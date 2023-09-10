import { Inject, UseGuards, forwardRef } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { GameManager } from './game-manager';
import { Direction, GameInfo } from './game';

@WebSocketGateway({ namespace: 'game' })
@UseGuards(AuthenticatedGuard)
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(
    @Inject(forwardRef(() => GameManager))
    private gameManager: GameManager,
  ) {}

  handleConnection(client: any) {
    const user = client.request.user;
    if (!user) {
      client.disconnect();
      return;
    }
    client.data = {
      user: user,
    };
  }

  handleDisconnect(client: Socket) {
    this.gameManager.playerDisconnect(client.data.gameId, client.data.user.id);
  }

  @SubscribeMessage('new')
  handleNew(
    @ConnectedSocket() client: Socket,
  ) {
    const gameId = this.gameManager.new(
      client.data.user.id,
      client.data.user.firstName
    );
    client.data.gameId = gameId;
    client.join(gameId);
  }

  @SubscribeMessage('input')
  handleInput(
    @ConnectedSocket() client: Socket,
    @MessageBody() direction: Direction,
  ) {
    this.gameManager.playerInput(
      client.data.gameId,
      client.data.user.id,
      direction,
    );
  }

  async isUserPlaying(userId: number): Promise<boolean> {
    const sockets = await this.wss.fetchSockets();
    if (sockets.find((socket) => socket.data.user?.id === userId)) return true;
    return false;
  }

  broadcastInfo(uuid: string, gameInfo: GameInfo) {
    this.wss.in(uuid).emit('game', gameInfo);
  }
}
