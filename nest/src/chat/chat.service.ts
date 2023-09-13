import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  PayloadTooLargeException,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateChannelNameDto } from './dto/update-channel-name.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatGateway } from './chat.gateway';
import { UserEntity } from 'src/users/entities/user.entity';
import { compare, hash } from 'bcrypt';
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
    if (!member) return '';
    return member.role;
  }

  async create(createChannelDto: CreateChannelDto, userId: number) {
    let hashedPassword: string;
    let channel: ChannelEntity;

    if (
      createChannelDto.name.length == 0 ||
      createChannelDto.name.length > 25
    ) {
      throw new BadRequestException(
        'Channel name too long or too short, must not be empty and 25 characters max.',
      );
    }
    if (createChannelDto.password.length > 64) {
      throw new BadRequestException(
        'Password too long, must be 64 characters max.',
      );
    }

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
    await this.gateway.addToRoom(userId, channel.id);
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
    return channels.filter((channel) => {
      return channel.members.length == 0 || channel.members[0].role === 'LEFT';
    });
  }

  async findOne(id: number) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: id },
    });
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
    return channels;
  }

  async joinChannel(joinChannelDto: JoinChannelDto, user: UserEntity) {
    if ((await this.getRole(joinChannelDto.id, user.id)) === 'BANNED') {
      throw new HttpException(
        'You are banned from this channel',
        HttpStatus.FORBIDDEN,
      );
    }
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: joinChannelDto.id,
      },
    });
    if (!channel)
      throw new HttpException("Channel doesn't exist", HttpStatus.NOT_FOUND);
    if (!channel.isGroup)
      throw new HttpException("Channel isn't a group", HttpStatus.FORBIDDEN);
    if (!channel.isPublic)
      throw new HttpException('Channel is private', HttpStatus.FORBIDDEN);
    if (channel.password) {
      const passwordIsValid = await compare(
        joinChannelDto.password,
        channel.password,
      );
      if (!joinChannelDto.password || !passwordIsValid) {
        return { error: 'Incorrect password' };
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
    if (member) {
      if (member.role == 'LEFT') {
        await this.prisma.member.update({
          where: { id: member.id },
          data: { role: 'REGULAR' },
        });
      }
    } else {
      if (member) return channel;
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
    }
    await this.gateway.addToRoom(user.id, channel.id);
    return channel;
  }

  async leaveChannel(channelId: number, user: UserEntity) {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });
    if (!channel)
      throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
    if (!channel.isGroup) {
      this.delete(channelId);
      return;
    }
    const member = await this.prisma.member.findFirst({
      where: {
        channelId: channelId,
        userId: user.id,
      },
    });
    if (!member)
      throw new HttpException(
        'Not a member of this channel',
        HttpStatus.NOT_FOUND,
      );
    if (member.role === 'OWNER') {
      throw new HttpException(
        "Owner can't leave channel",
        HttpStatus.FORBIDDEN,
      );
    }
    await this.prisma.member.update({
      where: { id: member.id },
      data: { role: 'LEFT' },
    });
    this.gateway.broadcastLeaveChannel(user.id, channelId);
  }

  async openDM(user: UserEntity, otherId: number) {
    if (user.id === otherId) {
      throw new HttpException(
        "Can't start DM with yourself",
        HttpStatus.FORBIDDEN,
      );
    }
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
      include: {
        blocked: true,
        blockedBy: true,
      },
    });
    if (!otherUser)
      throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
    if (channel) return channel;
    if (otherUser.blockedBy.find((blockedUser) => blockedUser.id === user.id)) {
      throw new HttpException(
        'You have blocked this user',
        HttpStatus.FORBIDDEN,
      );
    }
    if (otherUser.blocked.find((blockedUser) => blockedUser.id === user.id)) {
      throw new HttpException(
        'You have been blocked by this user',
        HttpStatus.FORBIDDEN,
      );
    }
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

  async getUsers(id: number) {
    const users = await this.prisma.user.findMany({
      where: {
        members: {
          some: {
            channelId: id,
            role: { notIn: ['LEFT', 'BANNED'] },
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
    return users;
  }

  async getMessages(channelId: number, userId: number) {
    const messages = await this.prisma.message.findMany({
      where: { channelId: channelId },
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
                nickname: true,
              },
            },
          },
        },
      },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { blocked: true },
    });
    return messages.filter((message) => {
      return !user.blocked.find(
        (blockedUser) => blockedUser.id === message.author.user.id,
      );
    });
  }

  async postMessage(
    id: number,
    createMessageDto: CreateMessageDto,
    user: UserEntity,
  ) {
    if (
      createMessageDto.content.length == 0 ||
      createMessageDto.content.length > 512
    ) {
      throw new PayloadTooLargeException(
        'Message too long or too short, must not be empty or higher than 512 characters max.',
      );
    }
    const member = await this.prisma.member.findFirst({
      where: {
        userId: user.id,
        channelId: id,
      },
    });
    if (!member)
      throw new HttpException(
        'Not a member of this channel',
        HttpStatus.FORBIDDEN,
      );
    const dateNow = new Date();
    if (member.mutedUntil > dateNow) {
      throw new HttpException('You are muted', HttpStatus.FORBIDDEN);
    }
    const message = await this.prisma.message.create({
      data: {
        type: createMessageDto.type,
        content: createMessageDto.content,
        authorId: member.id,
        channelId: id,
      },
    });
    this.gateway.broadcastMessage(message);
    return message;
  }

  async updateName(id: number, updateChannelNameDto: UpdateChannelNameDto) {
    if (
      updateChannelNameDto.name.length == 0 ||
      updateChannelNameDto.name.length > 25
    ) {
      throw new BadRequestException(
        'Channel name too long or too short, must not be empty and 25 characters max.',
      );
    }
    const channel = await this.prisma.channel.update({
      where: { id: id },
      data: {
        name: updateChannelNameDto.name,
      },
    });
    if (!channel)
      throw new HttpException("Channel doesn't exist", HttpStatus.NOT_FOUND);
    return channel;
  }

  async addUser(channelId: number, toAddId: number, user: UserEntity) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });
    if (!channel.isGroup)
      throw new HttpException('Channel is a DM', HttpStatus.FORBIDDEN);
    const newUser = await this.prisma.user.findUnique({
      where: { id: toAddId },
      include: { blocked: true },
    });
    if (!newUser)
      throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
    if (newUser.blocked.find((blockedUser) => blockedUser.id === user.id)) {
      throw new HttpException('User has blocked you', HttpStatus.FORBIDDEN);
    }
    const member = await this.prisma.member.findFirst({
      where: {
        userId: toAddId,
        channelId: channelId,
      },
    });
    if (member) {
      if (
        member.role === 'OWNER' ||
        member.role === 'ADMIN' ||
        member.role === 'REGULAR'
      ) {
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
            connect: { id: toAddId },
          },
          channel: {
            connect: { id: channelId },
          },
        },
      });
    }
  }

  async kickUser(channelId: number, userId: number) {
    const member = await this.prisma.member.findFirst({
      where: {
        channelId: channelId,
        userId: userId,
      },
    });
    if (!member || member.role === 'BANNED' || member.role === 'LEFT') return;
    await this.prisma.member.update({
      where: {
        id: member.id,
      },
      data: {
        role: 'LEFT',
      },
    });
    this.gateway.broadcastLeaveChannel(userId, channelId);
  }

  async banUser(channelId: number, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user)
      throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
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
          user: {
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
      throw new HttpException("Can't ban owner", HttpStatus.FORBIDDEN);
    }
    await this.prisma.member.update({
      where: {
        id: member.id,
      },
      data: {
        role: 'BANNED',
      },
    });
    this.gateway.broadcastLeaveChannel(userId, channelId);
  }

  async unbanUser(channelId: number, userId: number) {
    const member = await this.prisma.member.findFirst({
      where: {
        channelId: channelId,
        userId: userId,
      },
    });
    if (!member || member.role !== 'BANNED') return;
    await this.prisma.member.update({
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
      throw new HttpException("Can't find user", HttpStatus.NOT_FOUND);
    }
    if (member.role !== 'REGULAR') {
      throw new HttpException(
        "User isn't a regular member",
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prisma.member.update({
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
      throw new HttpException("Can't find user", HttpStatus.NOT_FOUND);
    }
    if (member.role !== 'ADMIN') {
      throw new HttpException(
        "User isn't an admin member",
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prisma.member.update({
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
      throw new HttpException("Can't find user", HttpStatus.NOT_FOUND);
    }
    if (member.role === 'OWNER') {
      throw new HttpException("Can't mute owner", HttpStatus.FORBIDDEN);
    }
    const date = new Date(Date.now() + muteUserDto.time * 60 * 1000);
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
      throw new HttpException("Can't find user", HttpStatus.NOT_FOUND);
    }
    if (member.role === 'OWNER') {
      throw new HttpException("Can't unmute owner", HttpStatus.FORBIDDEN);
    }
    const date = new Date();
    await this.prisma.member.update({
      where: { id: member.id },
      data: {
        mutedUntil: date.toISOString(),
      },
    });
  }

  async updatePassword(channelId: number, password: string) {
    if (password) {
      if (password.length > 64) {
        throw new BadRequestException(
          'Password too long, must be 64 characters max.',
        );
      }
      const hashedPassword = await hash(password, roundsOfHashing);
      return await this.prisma.channel.update({
        where: { id: channelId },
        data: {
          isPasswordProtected: true,
          password: hashedPassword,
        },
      });
    } else {
      return await this.prisma.channel.update({
        where: { id: channelId },
        data: {
          isPasswordProtected: false,
          password: null,
        },
      });
    }
  }

  async transferOwnership(
    channelId: number,
    owner: UserEntity,
    newOwnerId: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: newOwnerId },
    });
    if (!user)
      throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });
    if (!channel.isGroup) {
      throw new HttpException(
        "Can't transfer ownership of DM",
        HttpStatus.BAD_REQUEST,
      );
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
      throw new HttpException("New owner isn't a member", HttpStatus.NOT_FOUND);
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

  async delete(id: number) {
    await this.gateway.broadcastDeleteChannel(id);
    await this.prisma.channel.delete({
      where: {
        id: id,
      },
      include: {
        members: true,
        messages: true,
      },
    });
  }
}
