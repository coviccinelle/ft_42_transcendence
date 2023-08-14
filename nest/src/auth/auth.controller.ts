import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { domainName } from 'src/main';
import { Response } from 'express';
import { FtAuthGuard } from './guards/ft-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    return req.user;
  }

  @Post('local/signup')
  async signup(
    @Body() { email, firstName, lastName, password }: LoginDto,
  ): Promise<UserEntity> {
    return await this.authService.signup(firstName, lastName, email, password);
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

  @Get('logout')
  logout(@Request() req, @Res() response: Response): any {
    req.session.destroy();
    console.log('Successful logout');
    response.redirect(`http://${domainName}/login`);
    // return { msg: 'The user session ended'};
  }
}
