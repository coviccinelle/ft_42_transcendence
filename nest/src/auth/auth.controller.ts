import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './google-auth.guard';
import { Request } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Get('status')
  statusUser(@Req() request: Request) {
    console.log('Requesting status for user:');
    console.log(request.user);
    if (request.user) {
      return 'User authenticated';
    } else {
      return 'User not authenticated';
    }
  }
}
