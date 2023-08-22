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
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageEntity } from './entities/message.entity';

@WebSocketGateway({ namespace: 'chat' })
@UseGuards(AuthenticatedGuard)
export class ChatGateway implements OnGatewayConnection {
  constructor(private prisma: PrismaService) {}
  @WebSocketServer() wss: Server;

  async handleConnection(client: any, ...args: any[]) {
    const user = client.request.user;
    if (!user) {
      client.disconnect();
      return;
    }
    const members = await this.prisma.member.findMany({
      where: {
        userId: user.id,
      },
    });
    for (const member of members) {
      client.join(member.channelId.toString());
    }
  }

  broadcastMessage(payload: MessageEntity) {
    this.wss.to(payload.channelId.toString()).emit('message', payload);
  }
}
