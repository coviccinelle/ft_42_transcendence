import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ReportErrors } from 'src/main';
import { Response } from 'express';
import { FtAuthGuard } from './guards/ft-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { User } from 'src/users/users.decorator';
import { UsersService } from 'src/users/users.service';
import { TwoFAAuthGuard } from './guards/twofa-auth.guard';
import { TotpCodeDto } from './dto/totpCode.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('local/login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    const user = req.user;

    console.log('LOGIN user ' + user.email);
    if (user.isTwoFAEnabled) {
      console.log('LOGIN user ' + user.email + ' need to do 2fa auth.');
      req.session.needTwoFA = true;
    } else {
      req.session.needTwoFA = false;
    }
    return user;
  }

  @Post('local/signup')
  async signup(
    @Body() { email, password }: LoginDto,
  ): Promise<UserEntity | ReportErrors> {
    return await this.authService.signup(email, password);
  }

  @Get('ft/login')
  @UseGuards(FtAuthGuard)
  loginFt() {}

  @Get('ft/callback')
  @UseGuards(FtAuthGuard)
  redirectFt(@Req() req, @Res() response: Response) {
    const user = req.user;

    console.log('LOGIN user ' + user.email);
    if (user.isNewUser) {
      return response.redirect('/registration');
    }
    if (user.isTwoFAEnabled) {
      console.log('LOGIN user ' + user.email + ' need to do 2fa auth.');
      req.session.needTwoFA = true;
      return response.redirect('/login/verify-2fa?userEmail=' + user.email);
    }
    req.session.needTwoFA = false;
    return response.redirect('/');
  }

  @Post('2fa/login')
  @UseGuards(TwoFAAuthGuard)
  loginTwoFA(@Request() req) {
    req.session.needTwoFA = false;
    console.log('LOGIN 2FA user ' + req.user.email);
    return req.user;
  }

  /**
   * To generate the qrcode to add to the app for the user
   * ! IMPORTANT: do this first and then turn on 2FA
   * @param user
   * @returns dataURL to generate qrcode image
   */
  @Get('2fa/qrcode')
  @UseGuards(AuthenticatedGuard)
  async getQrcodeTwoFA(@User() user): Promise<string> {
    const qrcodeImage = await this.authService.generateQrCodeDataURL(user);
    console.log('2FA generating qrcode for user ' + user.email);
    return qrcodeImage;
  }

  /**
   * To enable 2FA
   * ! IMPORTANT: do this after getting and showing the qrcode to the user
   * @param user
   * @param body With the user imput "twoFactorAuthenticationCode" inside
   */
  @Post('2fa/turn-on')
  @UseGuards(AuthenticatedGuard)
  async turnOnTwoFA(
    @User() user,
    @Body() totpCodeDto: TotpCodeDto,
  ): Promise<any> {
    console.log('2FA TURN-ON try user ' + user.email);
    if (user.isTwoFAEnabled) return { message: '2fa is already enabled.' };
    if (!user.twoFASecret) return { message: 'No secret generated.' };

    // * Validation with user
    const isCodeValid = this.authService.isTwoFACodeValid(
      user.twoFASecret,
      totpCodeDto.code,
    );
    console.log('2FA code validity is ' + isCodeValid);
    if (!isCodeValid) return { message: 'Wrong 2fa code.' };

    console.log('2FA enabled for user ' + user.email);
    await this.usersService.enableTwoFA(user.id);
  }

  /**
   * To disable 2FA
   * * Note: The user needs to confirm with his already enabled 2FA
   * @param user
   * @param body With the user imput "twoFactorAuthenticationCode" inside
   */
  @Post('2fa/turn-off')
  @UseGuards(AuthenticatedGuard)
  async turnOffTwoFA(
    @User() user,
    @Body() totpCodeDto: TotpCodeDto,
  ): Promise<any> {
    console.log('2FA TURN-OFF try user ' + user.email);
    if (!user.isTwoFAEnabled) return { message: '2fa is already disabled.' };

    // * Confirmation to disable 2FA
    const isCodeValid = this.authService.isTwoFACodeValid(
      user.twoFASecret,
      totpCodeDto.code,
    );
    console.log('2FA code validity is ' + isCodeValid);
    if (!isCodeValid) return { message: 'Wrong 2fa code.' };

    console.log('2FA enabled for user ' + user.email);
    await this.usersService.disableTwoFA(user.id);
  }

  @Get('logout')
  logout(@Request() req, @Res() response: Response): any {
    req.session.destroy();
    response.redirect('/');
  }

  @Get('status')
  @UseGuards(AuthenticatedGuard)
  status(@Request() req): UserEntity {
    return req.user;
  }
}
