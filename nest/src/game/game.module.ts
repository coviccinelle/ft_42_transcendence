import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { GameManager } from './game-manager';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [GameService, GameGateway, GameManager, PrismaService],
  controllers: [GameController],
  exports: [GameGateway],
})
export class GameModule {}
