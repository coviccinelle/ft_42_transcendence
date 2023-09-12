import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string, done: any): Promise<UserEntity> {
    if (!email || !password) {
      return done(null, false);
      // throw new NotAcceptableException("No email or password provided.");
    }
    
    const user = await this.authService.login(email, password);

    if (!user) {
      throw new UnauthorizedException("User doesn't exist.");
    }

    return done(null, user);
  }
}
