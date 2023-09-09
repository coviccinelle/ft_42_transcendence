import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    PassportModule.register({ session: true }),
    ChatModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
