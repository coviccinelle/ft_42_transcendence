import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
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
    return `This action returns a #${id} channel`;
  }

  async getMyChannels(user: UserEntity) {
    return this.prisma.channel.findMany({
      where: {
        members: {
          some: { userId: user.id },
        },
      },
    });
  }

  async getMessages(id: number) {
    return await this.prisma.message.findMany({
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

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel named ${updateChannelDto.name}`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
