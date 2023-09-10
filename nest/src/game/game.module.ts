import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { GameManager } from './game-manager';

@Module({
  providers: [GameService, GameGateway, GameManager],
  controllers: [GameController],
  exports: [GameGateway],
})
export class GameModule {}
