import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateChannelNameDto } from './dto/update-channel-name.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatGateway } from './chat.gateway';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService, private gateway: ChatGateway) {}

  create(createChannelDto: CreateChannelDto) {
    return `This action adds a new channel named ${createChannelDto.name}`;
  }

  findPublic() {
    return this.prisma.channel.findMany({
      where: { isPublic: true },
    });
  }

  findOne(id: number) {
    return this.prisma.channel.findUnique({
      where: { id: id },
    });
  }

  getMyChannels(user: UserEntity) {
    return this.prisma.channel.findMany({
      where: {
        members: {
          some: { userId: user.id },
        },
      },
    });
  }

  getUsers(id: number) {
    return this.prisma.user.findMany({
      where: {
        members: {
          some: {channelId: id},
        },
      },
    })
  }

  getMessages(id: number) {
    return this.prisma.message.findMany({
      where: { channelId: id },
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
      where: { id: id},
      data: {
        name: updateChannelNameDto.name,
      }
    });
    this.gateway.broadcastUpdateChannel(id);
    return channel;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
