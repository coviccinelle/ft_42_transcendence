import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {Profile, Strategy, VerifyCallback} from "passport-google-oauth20";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UserEntity } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService) {
    super({ // TODO: mettre dans le .env, nom de domaine/ip variable
      clientID : '379990328360-621730jc9qgjleaqkn5lus5vubk6vsnk.apps.googleusercontent.com',
      clientSecret: "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",
      callbackURL: "http://localhost:8080/api/auth/google/redirect",
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string,
                profile: Profile, done: VerifyCallback): Promise<UserEntity> {
    const {name, emails, photos} = profile;
    console.log(profile);

    const user = await this.usersService.findOneByEmail(emails[0].value);
    if (user) {
      console.log(user);
      return user;
    }
    else { // If no user -> Create new user
      const newUserDto: CreateUserDto = {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
        password: null
      };
      console.log(newUserDto);
      return this.usersService.create(newUserDto);
    }
  }
}
