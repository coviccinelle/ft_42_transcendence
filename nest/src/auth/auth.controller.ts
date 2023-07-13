import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/users.decorator';
import { domainName } from 'src/main';
import { Response } from 'express';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { FtAuthGuard } from './guards/ft-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
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
  redirectGoogle(@Res() response: Response) {
    response.redirect(`http://${domainName}/profile`);
  }

  @Get('ft/login')
  @UseGuards(FtAuthGuard)
  loginFt() {}

  @Get('ft/callback')
  @UseGuards(FtAuthGuard)
  redirectFt(@Res() response: Response) {
    response.redirect(`http://${domainName}/profile`);
  }
}
