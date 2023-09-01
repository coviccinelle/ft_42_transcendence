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

  async validate(username: string, password: string): Promise<UserEntity> {
    if (!username || !password) {
      throw new NotAcceptableException("No username or password provided.");
    }
    
    const user = await this.authService.login(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
