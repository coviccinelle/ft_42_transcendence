import { Injectable } from '@nestjs/common';
import { GameManager } from './game-manager';

@Injectable()
export class GameService {
  constructor(private readonly gameManager: GameManager) {}

  createPrivateGame(): string {
    return this.gameManager.create();
  }
}
