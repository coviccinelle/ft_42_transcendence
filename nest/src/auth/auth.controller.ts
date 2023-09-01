import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Request,
  Res,
  UnauthorizedException,
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
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { User } from 'src/users/users.decorator';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly usersService: UsersService) {}

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
    response.redirect(`http://${domainName}/`);
  }

  @Get('ft/login')
  @UseGuards(FtAuthGuard)
  loginFt() {}

  @Get('ft/callback')
  @UseGuards(FtAuthGuard)
  redirectFt(@Res() response: Response) {
    response.redirect(`http://${domainName}/`);
  }

  /**
   * To generate the qrcode to add to the app for the user
   * ! IMPORTANT: do this first and then turn on 2FA
   * @param user 
   * @returns dataURL to generate qrcode image
   */
  @Get('2fa/qrcode')
  @UseGuards(AuthenticatedGuard)
  async getQrcodeTwoFA(@User() user) {
    const dataURL = await this.authService.generateQrCodeDataURL(user);
    return (dataURL);
  }

  /**
   * To enable 2FA
   * ! IMPORTANT: do this after getting and showing the qrcode to the user
   * @param user 
   * @param body With the user imput "twoFactorAuthenticationCode" inside
   */
  @Post('2fa/turn-on')
  @UseGuards(AuthenticatedGuard)
  async turnOnTwoFA(@User() user, @Body() body) {
    if (user.isTwoFAEnabled)
      throw new ConflictException("2FA is already enabled.");
    if (!user.twoFASecret) // TODO: test if possible to get ?
      throw new ConflictException("No secret generated.");

    // * Validation with user
    const isCodeValid = this.authService.isTwoFACodeValid(
      body.twoFactorAuthenticationCode,
      user,
    );
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong 2FA code');

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
  async turnOffTwoFA(@User() user, @Body() body) {
    if (!user.isTwoFAEnabled)
      throw new ConflictException("2FA is already disabled.");

    // * Confirmation to disable 2FA
    const isCodeValid = this.authService.isTwoFACodeValid(
      body.twoFactorAuthenticationCode,
      user,
    );
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong 2FA code');

    await this.usersService.disableTwoFA(user.id);
  }

  @Get('logout')
  logout(@Request() req, @Res() response: Response): any {
    req.session.destroy();
    console.log('Successful logout');
    response.redirect(`http://${domainName}/`);
    // return { msg: 'The user session ended'};
  }

  @Get('status')
  @UseGuards(AuthenticatedGuard)
  status(@Request() req) {
    return req.user;
  }
}
