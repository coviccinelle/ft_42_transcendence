import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { ChatModule } from 'src/chat/chat.module';
import { UsersGateway } from './users.gateway';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersGateway],
  imports: [PrismaModule, ChatModule],
  exports: [UsersService],
})
export class UsersModule {}
