import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatModule } from 'src/chat/chat.module';
import { UsersGateway } from './users.gateway';
import { GameModule } from 'src/game/game.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersGateway],
  imports: [PrismaModule, ChatModule, GameModule],
  exports: [UsersService],
})
export class UsersModule {}
