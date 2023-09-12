import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
// import { Strategy } from 'passport-custom';

@Injectable()
export class TwoFAStrategy extends PassportStrategy(Strategy, 'twofa') {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'code',
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    email: string,
    code: string,
    done: any,
  ): Promise<any> {
    if (!req.session.needTwoFA)
      throw new UnauthorizedException('2FA not enabled or already verified');
    const user = await this.usersService.findOneByEmail(email);

    if (!user)
      throw new UnauthorizedException('No valid user provided');

    const isValid = this.authService.isTwoFACodeValid(user.twoFASecret, code);

    if (isValid)
      return done(null, user);
    else
      throw new UnauthorizedException('TOTP code is invalid');
  }
}
