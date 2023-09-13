import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { VerifyCallback } from 'passport-oauth2';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { domainName } from 'src/main';
import { getProfileFt } from '../utils/ft.utils';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ft') {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FT_CLIENT_ID'),
      clientSecret: configService.get<string>('FT_CLIENT_SECRET'),
      authorizationURL: `https://api.intra.42.fr/oauth/authorize`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      callbackURL: `http://${domainName}/api/auth/ft/callback`,
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<UserEntity> {
    const profileData = await getProfileFt(accessToken);

    const user = await this.usersService.findOneByEmail(profileData.email);

    if (user) {
      return user;
    } else {
      // If no user => Create new user
      const newUserDto: CreateUserDto = {
        email: profileData.email,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        picture: profileData.image.versions.medium,
        nickname: null,
        password: null,
      };
      return this.usersService.create(newUserDto);
    }
  }
}
