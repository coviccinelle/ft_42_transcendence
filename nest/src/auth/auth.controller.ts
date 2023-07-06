import { Body, Controller, ForbiddenException, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './google-auth.guard';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/users.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  loginGoogle() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  redirectGoogle() {
    return 'Google logged !'
  }

  @Get('ft/redirect')
  redirectFt(@Param('state') state: string, @Param('code') code: string) {
    const randomState = this.configService.get<string>('FT_STATE');
    if (state !== randomState)
      throw new ForbiddenException(); // ! Hacker ???
    console.log("Ft state OK.");
    return this.authService.loginFt(code, state);
  }

  @Get('status')
  statusUser(@User() user: UserEntity) {
    // console.log(user)
    if (user) {
      console.log('Requesting status for user ' + user.email);
      return { auth: true, msg: 'User authenticated' };
    } else {
      console.log('Requesting status for non authenticated user');
      return { auth: false, msg: 'User authenticated' };
    }
  }
}
