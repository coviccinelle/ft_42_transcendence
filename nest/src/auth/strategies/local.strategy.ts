import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthService } from '../auth.service';
import { VerifyCallback } from 'passport-oauth2';
import { errors } from 'src/main';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string, done: VerifyCallback): Promise<any> {
    if (!email || !password) {
      return done(null, false, errors[1]);
    }

    const user = await this.authService.login(email, password);

    if (!user) {
      return done(null, false, errors[1]);
    }

    return done(null, user);
  }
}
