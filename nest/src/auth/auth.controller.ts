import { Body, Controller, ForbiddenException, Get, Param, Post, Redirect, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/users.decorator';
import { ConfigService } from '@nestjs/config';
import { domainName } from 'src/main';
import { Request, Response } from 'express';

function generateRandomString(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

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

  @Get('ft/login')
  loginFt(@Res() response: Response, @Session() session) {
    const state = generateRandomString();
    session.oauthState = state;

    const redirect_uri = encodeURIComponent(`http://${domainName}/api/auth/ft/callback`);
    const redirectUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${this.configService.get<string>('FT_CLIENT_ID') || 'client_id_undefined'}&redirect_uri=${redirect_uri}&response_type=code&state=${state}`

    response.redirect(redirectUrl);
  }

  @Get('ft/callback')
  async callbackFt(@Req() request: Request, @Res() response: Response, @Session() session): Promise<void> {
    const code: string = request.query.code as string
    const state: string = request.query.state as string;
    const storedState = session.oauthState;

    if (state !== storedState)
      throw new ForbiddenException(); // ! Hacker ???
    console.log("Ft state OK.");
    delete session.oauthState;

    const responseData = await this.authService.loginFt(code);

    console.log(responseData); // ? donne un access_token etc
    console.log(session);
    // TODO: requests pour avoir les info profil et ajouter a la db

    response.redirect('http://localhost:8080/')
  }

  @Get('status')
  statusUser(@User() user: UserEntity) {
    // console.log(user)
    if (user) {
      console.log('Requesting status for user ' + user.email);
      return { auth: true, msg: 'User authenticated' };
    } else {
      console.log('Requesting status for non authenticated user');
      return { auth: false, msg: 'User not authenticated' };
    }
  }
}
