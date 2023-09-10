import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

@WebSocketGateway({ namespace: 'game' })
@UseGuards(AuthenticatedGuard)
export class GameGateway {
  @WebSocketServer() wss: Server;

  @SubscribeMessage('new')
  async handleNew(
    @ConnectedSocket() client: Socket,
  ) {
    
  }

  async isUserPlaying(userId: number): Promise<boolean> {
    const sockets = await this.wss.fetchSockets();
    if (sockets.find((socket) => socket.data.user?.id === userId)) return true;
    return false;
  }
}
