import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateChannelNameDto } from './dto/update-channel-name.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatGateway } from './chat.gateway';
import { UserEntity } from 'src/users/entities/user.entity';
import { hash } from 'bcrypt';
import { roundsOfHashing } from 'src/users/users.service';
import { ChannelEntity } from './entities/channel.entity';
import { JoinChannelDto } from './dto/join-channel.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService, private gateway: ChatGateway) {}

  async getRole(channelId: number, userId: number) {
    const member = await this.prisma.member.findFirst({
      where: {
        channelId: channelId,
        userId: userId,
      },
    });
    if (!member) return "";
    return member.role;
  }

  async create(createChannelDto: CreateChannelDto, userId: number) {
    let hashedPassword: string;
    let channel: ChannelEntity;
    if (createChannelDto.isPublic && createChannelDto.password) {
      hashedPassword = await hash(createChannelDto.password, roundsOfHashing);
      channel = await this.prisma.channel.create({
        data: {
          name: createChannelDto.name,
          isGroup: true,
          isPublic: createChannelDto.isPublic,
          isPasswordProtected: true,
          password: hashedPassword,
        },
      });
    } else {
      channel = await this.prisma.channel.create({
        data: {
          name: createChannelDto.name,
          isGroup: true,
          isPublic: createChannelDto.isPublic,
          isPasswordProtected: false,
        },
      });
    }
    const member = await this.prisma.member.create({
      data: {
        role: 'OWNER',
        user: {
          connect: { id: userId },
        },
        channel: {
          connect: { id: channel.id },
        },
      },
    });
    channel.password = null;
    return channel;
  }

  async findPublic(userId: number) {
    const channels = await this.prisma.channel.findMany({
      where: { isPublic: true },
      include: {
        members: {
          where: {
            userId: userId,
          },
        },
      },
    });
    channels.forEach((channel) => {
      channel.password = null;
    });
    return channels.filter((channel) => {
      return (channel.members.length == 0) || (channel.members[0].role === 'LEFT');
    });
  }

  async findOne(id: number) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: id },
    });
    if (channel) channel.password = null;
    return channel;
  }

  async getMyChannels(user: UserEntity) {
    const channels = await this.prisma.channel.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
            role: {
              in: ['OWNER', 'ADMIN', 'REGULAR'],
            },
          },
        },
      },
    });
    channels.forEach((channel) => {
      channel.password = null;
    });
    return channels;
  }

  async joinChannel(joinChannelDto: JoinChannelDto, user: UserEntity) {
    if (await this.getRole(joinChannelDto.id, user.id) === 'BANNED') {
      throw new HttpException('You are banned from this channel', HttpStatus.FORBIDDEN);
    }
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: joinChannelDto.id,
      },
    });
    if (!channel) throw new HttpException('Channel doesn\'t exist', HttpStatus.NOT_FOUND);
    if (!channel.isPublic) throw new HttpException('Channel is private', HttpStatus.FORBIDDEN);
    if (channel.password) {
      if (
        !joinChannelDto.password
        || await hash(joinChannelDto.password, roundsOfHashing) !== channel.password
      ) {
        throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);
      }
    }
    //Check if member already exists
    let member = await this.prisma.member.findFirst({
      where: {
        userId: user.id,
        channelId: joinChannelDto.id,
      },
    });
    //Rejoin channel
    if (member && member.role == 'LEFT') {
      return await this.prisma.member.update({
        where: { id: member.id },
        data: { role: 'REGULAR' },
      });
    }
    member = await this.prisma.member.create({
      data: {
        role: 'REGULAR',
        user: {
          connect: { id: user.id },
        },
        channel: {
          connect: { id: channel.id },
        },
      },
    });
    channel.password = null;
    return channel;
  }

  async leaveChannel(channelId: number, user: UserEntity) {
    const member = await this.prisma.member.findFirst({
      where: {
        channelId: channelId,
        userId: user.id,
      },
    });
    if (!member) throw new HttpException('Not a member of this channel', HttpStatus.NOT_FOUND);
    member.role = 'LEFT';
    return member;
  }

  getUsers(id: number) {
    return this.prisma.user.findMany({
      where: {
        members: {
          some: { channelId: id },
        },
      },
    });
  }

  getMessages(id: number) {
    return this.prisma.message.findMany({
      where: { channelId: id },
      include: {
        author: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                picture: true,
              },
            },
          },
        },
      },
    });
  }

  async postMessage(
    id: number,
    createMessageDto: CreateMessageDto,
    user: UserEntity,
  ) {
    const member = await this.prisma.member.findFirst({
      where: {
        userId: user.id,
        channelId: id,
      },
    });
    if (!member) throw new HttpException('Not a member of this channel', HttpStatus.FORBIDDEN);
    const message = await this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        authorId: member.id,
        channelId: id,
      },
    });
    this.gateway.broadcastMessage(message);
    return message;
  }
  
  async updateName(id: number, updateChannelNameDto: UpdateChannelNameDto) {
    const channel = await this.prisma.channel.update({
      where: { id: id },
      data: {
        name: updateChannelNameDto.name,
      },
    });
    if (!channel) throw new HttpException('Channel doesn\'t exist', HttpStatus.NOT_FOUND);
    this.gateway.broadcastUpdateChannel(id);
    channel.password = null;
    return channel;
  }

  async addUser(channelId: number, userId: number) {
    let member = await this.prisma.member.findFirst({
      where: {
        userId: userId,
        channelId: channelId,
      },
    });
    if (member) return;
    member = await this.prisma.member.create({
      data: {
        role: 'REGULAR',
        user: {
          connect: { id: userId },
        },
        channel: {
          connect: { id: channelId },
        },
      },
    });
    this.gateway.broadcastUpdateUser(userId, channelId);
  }

  async kickUser(channelId: number, userId: number) {
    const member = await this.prisma.member.findFirst({
      where: {
        channelId: channelId,
        userId: userId,
      },
    });
    if (!member) return;
    this.prisma.member.update({
      where: {
        id: member.id,
      },
      data: {
        role: 'LEFT',
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
