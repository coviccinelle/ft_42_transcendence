import { UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RolesGuard } from './roles.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageEntity } from './entities/message.entity';
import { Roles } from './roles.decorator';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from 'src/users/users.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

@WebSocketGateway({ namespace: 'chat' })
@UseGuards(RolesGuard)
export class ChatGateway implements OnGatewayConnection {
  constructor(private prisma: PrismaService) {}
  @WebSocketServer() wss: Server;

  async handleConnection(client: any, ...args: any[]) {
    const user = client.request.user;
    if (!user) {
      client.disconnect();
      return;
    }
    client.data = {
      user: user,
    };
    const members = await this.prisma.member.findMany({
      where: {
        userId: user.id,
      },
    });
    for (const member of members) {
      client.join(member.channelId.toString());
    }
  }

  @SubscribeMessage('message')
  @Roles('regular')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    const user = client.data.user;
    const member = await this.prisma.member.findFirst({
      where: {
        userId: user.id,
        channelId: createMessageDto.channelId,
      },
    });
    const dateNow = new Date();
    if (member.mutedUntil > dateNow) {
      return;
    }
    const message = await this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        authorId: member.id,
        channelId: createMessageDto.channelId,
      },
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
                password: true,
              },
            },
          },
        },
      },
    });
    message.author.user.password = null;
    // client.to(createMessageDto.channelId.toString()).emit('message', message);
    this.broadcastMessage(message);
  }

  broadcastMessage(payload: MessageEntity) {
    console.log(`Sending message ${payload.content}`);
    this.wss.to(payload.channelId.toString()).emit('message', payload);
  }

  async broadcastUpdateChannel(channelId: number) {
    const users = await this.prisma.user.findMany({
      where: {
        members: {
          some: { channelId: channelId },
        },
      },
    });
    users.forEach((user) => this.broadcastUpdateUser(user.id, channelId));
  }

  async broadcastUpdateUser(userId: number, channelId: number) {
    const sockets = await this.wss.fetchSockets();
    for (const socket of sockets) {
      if (socket.data.user.id === userId) {
        socket.emit('update', channelId);
      }
    }
  }
}
