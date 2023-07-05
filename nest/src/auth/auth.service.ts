import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(lemail: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({
      where: { email: lemail },
    });

    if (!user) {
      throw new NotFoundException(`No user found with email: ${lemail}`);
    }

    const isPasswordValid = await compare(password, (await user).password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(`Invalid password`);
    }

    return {
      accessToken: this.jwt.sign({ userId: (await user).id }),
    };
  }
}
