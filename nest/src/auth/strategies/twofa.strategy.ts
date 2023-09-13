import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { VerifyCallback } from 'passport-oauth2';
import { errors } from 'src/main';
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
    done: VerifyCallback,
  ): Promise<any> {
    if (!req.session.needTwoFA) return done(null, false, errors[2]);
    const user = await this.usersService.findOneByEmail(email);

    if (!user) return done(null, false, errors[1]);

    const isValid = this.authService.isTwoFACodeValid(user.twoFASecret, code);

    if (isValid) return done(null, user);
    else return done(null, false, errors[1]);
  }
}
