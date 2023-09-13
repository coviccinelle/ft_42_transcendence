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
import { validateEmail } from 'src/main';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const lowerEmail = email.toLowerCase();
    if (!email || !validateEmail(email)) {
      throw new BadRequestException("Email is not valid.");
    }
    const user = await this.usersService.findOneByEmail(lowerEmail);

    if (user) {
      throw new ConflictException(
        `User found while registering with email: ${lowerEmail}`,
      );
    }
    const newUserDto: CreateUserDto = {
      email: lowerEmail,
      firstName: firstName,
      lastName: lastName,
      nickname: null,
      picture:
        'https://i.pinimg.com/originals/a4/97/d7/a497d78803c0821e1f0cdb8b8b8a6d32.jpg',
      password: password,
    };
    return new UserEntity(await this.usersService.create(newUserDto));
  }

  async login(email: string, password: string): Promise<UserEntity> {
    const lowerEmail = email.toLowerCase();
    if (!email || !validateEmail(email)) {
      throw new BadRequestException("Email is not valid.");
    }

    const user = await this.usersService.findOneByEmail(lowerEmail);

    if (password.length == 0 || password.length > 64) {
      throw new BadRequestException("Password too long or too short, must not be empty and 64 characters max.");
    }
    if (!user) {
      throw new NotFoundException(`No user found with email: ${lowerEmail}`);
    }

    const isPasswordValid = await compare(password, (await user).password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(`Invalid password`);
    }

    return user;
  }

  async generateQrCodeDataURL(user: UserEntity) {
    const secret = authenticator.generateSecret();
    await this.usersService.setTwoFASecret(user.id, secret);

    const otpAuthUrl = authenticator.keyuri(user.email, "Duckie Pong", secret);

    return toDataURL(otpAuthUrl);
  }

  isTwoFACodeValid(userTwoFASecret: string, code: string) {
    if (code.length > 6) {
      throw new BadRequestException("Code too long, must be 6 characters max.");
    }

    return (
      authenticator.verify({
        token: code,
        secret: userTwoFASecret,
      })
    );
  }
}
