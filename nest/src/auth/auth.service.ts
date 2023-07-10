import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entities/auth.entity';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { getTokenFt, getProfileFt} from './utils/ft.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  // TODO: signup/register

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(`No user found with email: ${email}`);
    }

    const isPasswordValid = await compare(password, (await user).password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(`Invalid password`);
    }

    return {
      accessToken: this.jwt.sign({ userId: (await user).id }),
    };
  }

  async loginFt(code: string) {
    const tokenData = await getTokenFt(code);
    const profileData = await getProfileFt(tokenData.access_token);

    const user = await this.usersService.findOneByEmail(profileData.email);

    if (user) {
      console.log(user);
      return user;
    } else { // If no user => Create new user
      const names = profileData.displayName.split(" ");
      const newUserDto: CreateUserDto = {
        email: profileData.email,
        firstName: names[0],
        lastName: names[1],
        picture: profileData.image_url,
        password: null,
      };
      console.log(newUserDto);
      return this.usersService.create(newUserDto);
    }

  }
}
