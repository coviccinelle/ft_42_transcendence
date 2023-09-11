import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { Direction, Game, GameStatus } from "./game";
import { GameGateway } from "./game.gateway";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GameManager {
  private games: Map<string, Game>;

  constructor(
    @Inject(forwardRef(() => GameGateway))
    private gameGateway: GameGateway,
    private prismaService: PrismaService,
  ) {}

  public getStatus(uuid: string): GameStatus {
    return this.games[uuid].getStatus();
  }

  public new(userId: number, userName: string): string {
    if (this.isInLobby(userId)) {
      //Todo Reject request
    }
    const openLobby = this.findOpenLobby();
    if (openLobby) {
      openLobby.addPlayer(userName, userId);
      return openLobby.getId();
    }
    const game = new Game(this.gameGateway, this.prismaService, true);
    const id = game.getId();
    game.addPlayer(userName, userId);
    this.games.set(id, game);
    return id;
  }

  public playerInput(uuid: string, userId: number, direction: Direction) {
    if (this.games[uuid].getStatus() === GameStatus.PLAYING) {
      this.games[uuid].playerInput(userId, direction);
    }
  }

  public playerDisconnect(uuid: string, userId: number) {
    this.games[uuid].removePlayer(userId);
    //Todo: remove game from array once done
  }

  private isInLobby(userId: number): boolean {
    for (const game of this.games.values()) {
      const ids = game.getPlayerIds();
      if (ids[0] === userId || ids[1] === userId) return true;
    }
    return false
  }

  private findOpenLobby(): Game | null {
    for (const game of this.games.values()) {
      if (game.getIsPublic() && game.getStatus() === GameStatus.WAITING) {
        return game;
      }
    }
    return null;
  }
}
