import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatGateway } from './chat.gateway';

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

  async getMessages(id: number) {
    return await this.prisma.message.findMany({
      where: { channelId: id },
    });
  }

  async postMessage(id: number, createMessageDto: CreateMessageDto) {
    this.gateway.broadcastMessage(
      createMessageDto.content,
      createMessageDto.authorId,
      id,
    );
    return await this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        authorId: createMessageDto.authorId,
        channelId: id,
      },
    });
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel named ${updateChannelDto.name}`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
