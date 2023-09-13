import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { SessionSerializer } from './session.serializer';
import { FtStrategy } from './strategies/ft.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { TwoFAStrategy } from './strategies/twofa.strategy';

@Module({
  imports: [ConfigModule, PrismaModule, PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    FtStrategy,
    TwoFAStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
