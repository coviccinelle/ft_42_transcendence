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
import { MuteUserDto } from './dto/mute-user.dto';

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
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });
    if (!channel.isGroup) {
      this.remove(channelId);
      return;
    }
    const member = await this.prisma.member.findFirst({
      where: {
        channelId: channelId,
        userId: user.id,
      },
    });
    if (!member) throw new HttpException('Not a member of this channel', HttpStatus.NOT_FOUND);
    if (member.role === 'OWNER') {
      throw new HttpException('Owner can\'t leave channel', HttpStatus.FORBIDDEN);
    }
    member.role = 'LEFT';
  }

  async openDM(user: UserEntity, otherId: number) {
    //Check if there is already a DM channel open
    const channel = await this.prisma.channel.findFirst({
      where: {
        isGroup: false,
        members: {
          every: {
            userId: { in: [user.id, otherId] },
          },
        },
      },
    });
    const otherUser = await this.prisma.user.findUnique({
      where: { id: otherId },
    });
    if (!otherUser) throw new HttpException('User doesn\'t exist', HttpStatus.NOT_FOUND);
    if (channel) return channel;
    const newChannel = await this.prisma.channel.create({
      data: {
        isGroup: false,
        isPublic: false,
        isPasswordProtected: false,
        name: '',
      },
    });
    await this.prisma.member.create({
      data: {
        role: 'OWNER',
        user: {
          connect: { id: user.id },
        },
        channel: {
          connect: { id: newChannel.id },
        },
      },
    });
    await this.prisma.member.create({
      data: {
        role: 'OWNER',
        user: {
          connect: { id: otherId },
        },
        channel: {
          connect: { id: newChannel.id },
        },
      },
    });
    return newChannel;
  }

  getUsers(id: number) {
    return this.prisma.user.findMany({
      where: {
        members: {
          some: { 
            channelId: id,
            role: { notIn: ['LEFT'] },
          },
        },
      },
      include: {
        members: {
          where: {
            channelId: id,
          },
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
    const dateNow = new Date();
    if (member.mutedUntil > dateNow) {
      throw new HttpException('You are muted', HttpStatus.FORBIDDEN);
    }
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
    const newUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!newUser) throw new HttpException('User doesn\'t exist', HttpStatus.NOT_FOUND);
    const member = await this.prisma.member.findFirst({
      where: {
        userId: userId,
        channelId: channelId,
      },
    });
    if (member) {
      if (member.role === 'OWNER'
        || member.role === 'ADMIN'
        || member.role === 'REGULAR') {
          return;
      }
      await this.prisma.member.update({
        where: { id: member.id },
        data: { role: 'REGULAR' },
      });
    } else {
      await this.prisma.member.create({
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
    }
    this.gateway.broadcastUpdateUser(userId, channelId);
  }

  async kickUser(channelId: number, userId: number) {
    const member = await this.prisma.member.findFirst({
      where: {
        channelId: channelId,
        userId: userId,
      },
    });
    if (!member || member.role === 'BANNED' || member.role === 'LEFT') return;
    this.prisma.member.update({
      where: {
        id: member.id,
      },
      data: {
        role: 'LEFT',
      },
    });
    this.gateway.broadcastUpdateUser(userId, channelId);
  }

  async banUser(channelId: number, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new HttpException('User doesn\'t exist', HttpStatus.NOT_FOUND);
    const member = await this.prisma.member.findFirst({
      where: {
        channelId: channelId,
        userId: userId,
      },
    });
    if (!member) {
      await this.prisma.member.create({
        data: {
          role: 'BANNED',
          user : {
            connect: { id: userId },
          },
          channel: {
            connect: { id: channelId },
          },
        },
      });
      return;
    }
    if (member.role === 'BANNED') return;
    if (member.role === 'OWNER') {
      throw new HttpException('Can\'t ban owner', HttpStatus.FORBIDDEN);
    }
    this.prisma.member.update({
      where: {
        id: member.id,
      },
      data: {
        role: 'BANNED',
      },
    });
    this.gateway.broadcastUpdateUser(userId, channelId);
  }

  async unbanUser(channelId: number, userId: number) {
    const member = await this.prisma.member.findFirst({
      where: {
        channelId: channelId,
        userId: userId,
      },
    });
    if (!member || member.role !== 'BANNED') return;
    this.prisma.member.update({
      where: {
        id: member.id,
      },
      data: {
        role: 'LEFT',
      },
    });
  }

  async promoteUser(channelId: number, userId: number) {
    const member = await this.prisma.member.findFirst({
      where: {
        channelId: channelId,
        userId: userId,
      },
    });
    if (!member || member.role === 'LEFT' || member.role === 'BANNED') {
      throw new HttpException('Can\'t find user', HttpStatus.NOT_FOUND);
    }
    if (member.role !== 'REGULAR') {
      throw new HttpException('User isn\'t a regular member', HttpStatus.BAD_REQUEST);
    }
    this.prisma.member.update({
      where: {
        id: member.id,
      },
      data: {
        role: 'ADMIN',
      },
    });
  }

  async demoteUser(channelId: number, userId: number) {
    const member = await this.prisma.member.findFirst({
      where: {
        channelId: channelId,
        userId: userId,
      },
    });
    if (!member || member.role === 'LEFT' || member.role === 'BANNED') {
      throw new HttpException('Can\'t find user', HttpStatus.NOT_FOUND);
    }
    if (member.role !== 'ADMIN') {
      throw new HttpException('User isn\'t an admin member', HttpStatus.BAD_REQUEST);
    }
    this.prisma.member.update({
      where: {
        id: member.id,
      },
      data: {
        role: 'REGULAR',
      },
    });
  }

  async muteUser(channelId: number, muteUserDto: MuteUserDto) {
    const member = await this.prisma.member.findFirst({
      where: {
        channelId: channelId,
        userId: muteUserDto.userId,
      },
    });
    if (!member || member.role === 'LEFT' || member.role === 'BANNED') {
      throw new HttpException('Can\'t find user', HttpStatus.NOT_FOUND);
    }
    if (member.role === 'OWNER') {
      throw new HttpException('Can\'t mute owner', HttpStatus.FORBIDDEN);
    }
    const date = new Date(Date.now() + muteUserDto.time * 60 * 1000)
    await this.prisma.member.update({
      where: { id: member.id },
      data: {
        mutedUntil: date.toISOString(),
      },
    });
  }

  async unmuteUser(channelId: number, muteUserDto: MuteUserDto) {
    const member = await this.prisma.member.findFirst({
      where: {
        channelId: channelId,
        userId: muteUserDto.userId,
      },
    });
    if (!member || member.role === 'LEFT' || member.role === 'BANNED') {
      throw new HttpException('Can\'t find user', HttpStatus.NOT_FOUND);
    }
    if (member.role === 'OWNER') {
      throw new HttpException('Can\'t unmute owner', HttpStatus.FORBIDDEN);
    }
    const date = new Date();
    await this.prisma.member.update({
      where: { id: member.id },
      data: {
        mutedUntil: date.toISOString(),
      },
    });
  }

  async transferOwnership(channelId: number, owner: UserEntity, newOwnerId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: newOwnerId },
    });
    if (!user) throw new HttpException('User doesn\'t exist', HttpStatus.NOT_FOUND);
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });
    if (!channel.isGroup) {
      throw new HttpException('Can\'t transfer ownership of DM', HttpStatus.BAD_REQUEST);
    }
    const ownerMember = await this.prisma.member.findFirst({
      where: {
        userId: owner.id,
        channelId: channelId,
      },
    });
    const newOwnerMember = await this.prisma.member.findFirst({
      where: {
        userId: newOwnerId,
        channelId: channelId,
      },
    });
    if (!newOwnerMember) {
      throw new HttpException('New owner isn\'t a member', HttpStatus.NOT_FOUND);
    }
    await this.prisma.member.update({
      where: { id: ownerMember.id },
      data: { role: 'ADMIN' },
    });
    await this.prisma.member.update({
      where: { id: newOwnerMember.id },
      data: { role: 'OWNER' },
    });
  }

  async remove(id: number) {
    await this.prisma.channel.delete({
      where: {
        id: id,
      },
      include: {
        members: true,
        messages: true,
      },
    });
    this.gateway.broadcastUpdateChannel(id);
  }
}
