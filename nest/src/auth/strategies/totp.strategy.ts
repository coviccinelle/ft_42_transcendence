import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { VerifyCallback } from 'passport-oauth2';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TotpStrategy extends PassportStrategy(Strategy, 'totp') {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super({
      authorizationURL: "",
      passReqToCallback: true,
    });
  }
  async validate(
    req: any,
    token: string,
    done: VerifyCallback,
  ): Promise<any> {
    console.log("TOTP REQUEST:");
    console.log(req);
    // const user = req.user;
    const user = await this.usersService.findOneByEmail(req.email);
    console.log(user);

    if (!user)
      return (done(null, false, { message: "No valid user provided" }));

    const isValid = this.authService.isTwoFACodeValid(user.twoFASecret, token);

    if (isValid)
      return (done(null, user));
    else
      return (done(null, false, { message: "TOTP code is invalid" }));
  }
}
