import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Direction, Game, GameStatus } from './game';
import { GameGateway } from './game.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class GameManager {
  private games: Map<string, Game>;

  constructor(
    @Inject(forwardRef(() => GameGateway))
    private gameGateway: GameGateway,
    private prismaService: PrismaService,
  ) {
    this.games = new Map<string, Game>();
  }

  public getStatus(uuid: string): GameStatus {
    return this.games.get(uuid).getStatus();
  }

  public new(userId: number, userName: string, isHard: boolean): string {
    if (this.isInLobby(userId)) {
      throw new WsException('You are already in a game');
    }
    const openLobby = this.findOpenLobby(isHard);
    if (openLobby) {
      openLobby.addPlayer(userName, userId);
      return openLobby.getId();
    }
    const game = new Game(this.gameGateway, this.prismaService, true, isHard);
    const id = game.getId();
    game.addPlayer(userName, userId);
    this.games.set(id, game);
    return id;
  }

  public create(): string {
    const game = new Game(this.gameGateway, this.prismaService, false, false);
    const id = game.getId();
    this.games.set(id, game);
    return id;
  }

  public join(uuid: string, userId: number, userName: string) {
    if (!this.games[uuid]) {
      throw new WsException("Game doesn't exist");
    }
    if (
      this.games[uuid].nbPlayers === 2 ||
      this.games[uuid].getStatus !== GameStatus.WAITING
    ) {
      throw new WsException('Game is full');
    }
    this.games[uuid].addPlayer(userName, userId);
  }

  public playerInput(uuid: string, userId: number, direction: Direction) {
    if (this.games[uuid].getStatus() === GameStatus.PLAYING) {
      this.games[uuid].playerInput(userId, direction);
    }
  }

  public playerDisconnect(uuid: string, userId: number) {
    this.games.get(uuid).removePlayer(userId);
    if (this.games[uuid].getNbPlayers === 0) {
      this.games.delete(uuid);
    }
  }

  private isInLobby(userId: number): boolean {
    for (const game of this.games.values()) {
      const ids = game.getPlayerIds();
      if (ids[0] === userId || ids[1] === userId) return true;
    }
    return false;
  }

  private findOpenLobby(isHard: boolean): Game | null {
    for (const game of this.games.values()) {
      if (
        game.getIsPublic() &&
        game.getIsHard() === isHard &&
        game.getStatus() === GameStatus.WAITING
      ) {
        return game;
      }
    }
    return null;
  }
}
