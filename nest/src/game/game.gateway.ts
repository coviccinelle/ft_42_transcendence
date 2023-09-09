import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

@WebSocketGateway({ namespace: 'game' })
@UseGuards(AuthenticatedGuard)
export class GameGateway {
  @WebSocketServer() wss: Server;

  async isUserPlaying(userId: number) {
    const sockets = await this.wss.fetchSockets();
    if (sockets.find((socket) => socket.data.user?.id === userId)) return true;
    return false;
  }
}
