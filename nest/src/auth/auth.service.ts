import { Injectable } from '@nestjs/common';
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

  async generateQrCodeDataURL(user: UserEntity): Promise<string> {
    const secret = authenticator.generateSecret();
    await this.usersService.setTwoFASecret(user.id, secret);

    const otpAuthUrl = authenticator.keyuri(user.email, 'Duckie Pong', secret);

    return toDataURL(otpAuthUrl);
  }

  isTwoFACodeValid(
    userTwoFASecret: string,
    code: string,
  ): boolean | ReportErrors {
    if (code.length !== 6) {
      return errors[7];
    }

    return authenticator.verify({
      token: code,
      secret: userTwoFASecret,
    });
  }
}
