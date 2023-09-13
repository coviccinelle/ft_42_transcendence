import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { ReportErrors, errors, limits, validateEmail } from 'src/main';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(
    email: string,
    password: string,
  ): Promise<UserEntity | ReportErrors> {
    const lowerEmail = email.toLowerCase();
    if (!email || !validateEmail(email)) {
      return (errors[3]);
    }
    const user = await this.usersService.findOneByEmail(lowerEmail);

    if (user) {
      return (errors[4]);
    }
    const newUserDto: CreateUserDto = {
      email: lowerEmail,
      nickname: null,
      picture: null,
      password: password,
    };
    return new UserEntity(await this.usersService.create(newUserDto));
  }

  async login(email: string, password: string): Promise<UserEntity | ReportErrors> {
    const lowerEmail = email.toLowerCase();
    if (!email || !validateEmail(email)) {
      return (errors[3]);
    }

    const user = await this.usersService.findOneByEmail(lowerEmail);

    if (password.length == 0 || password.length > limits.password) {
      return (errors[5]);
    }
    if (!user) {
      return (errors[1]);
    }

    const isPasswordValid = await compare(password, (await user).password);

    if (!isPasswordValid) {
      return (errors[6]);
    }

    return user;
  }

  async generateQrCodeDataURL(user: UserEntity): Promise<string> {
    const secret = authenticator.generateSecret();
    await this.usersService.setTwoFASecret(user.id, secret);

    const otpAuthUrl = authenticator.keyuri(user.email, "Duckie Pong", secret);

    return toDataURL(otpAuthUrl);
  }

  isTwoFACodeValid(userTwoFASecret: string, code: string): boolean | ReportErrors {
    if (code.length !== 6) {
      return errors[7];
    }

    return (
      authenticator.verify({
        token: code,
        secret: userTwoFASecret,
      })
    );
  }
}
