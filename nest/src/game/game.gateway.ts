import { Inject, UseGuards, forwardRef } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { GameManager } from './game-manager';
import { Direction, GameInfo, GameStatus } from './game';

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
    if (client.data.gameId && client.data.user) {
      this.gameManager.playerDisconnect(client.data.gameId, client.data.user.id);
    }
  }

  @SubscribeMessage('new')
  handleNew(
    @ConnectedSocket() client: Socket,
    @MessageBody() isHard: boolean,
  ) {
    const gameId = this.gameManager.new(
      client.data.user.id,
      client.data.user.firstName,
      isHard,
    );
    client.data.gameId = gameId;
    client.join(gameId);
    if (this.gameManager.getStatus(gameId) === GameStatus.WAITING) {
      client.emit('wait');
    }
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

  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() uuid: string,
  ) {
    this.gameManager.join(
      uuid,
      client.data.user.id,
      client.data.user.firstName,
    );
    client.data.gameId = uuid;
    client.join(uuid);
    if (this.gameManager.getStatus(uuid) === GameStatus.WAITING) {
      client.emit('wait');
    }
  }

  async isUserPlaying(userId: number): Promise<boolean> {
    const sockets = await this.wss.fetchSockets();
    if (sockets.find((socket) => socket.data.user?.id === userId)) return true;
    return false;
  }

  broadcastStart(uuid: string) {
    this.wss.in(uuid).emit('start', uuid);
  }

  broadcastInfo(uuid: string, gameInfo: GameInfo) {
    this.wss.in(uuid).emit('game', gameInfo);
  }

  broadcastWinner(uuid: string, winnerId: number) {
    this.wss.in(uuid).emit('winner', winnerId);
  }
}
