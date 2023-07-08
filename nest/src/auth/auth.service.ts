import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import { compare } from 'bcrypt';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { domainName } from 'src/main';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

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

  async loginFt(code: string): Promise<any> {
    const client_secret = this.configService.get<string>('FT_CLIENT_SECRET');
    const client_id = this.configService.get<string>('FT_CLIENT_ID');
    const redirect_uri = `http://${domainName}/api/auth/ft/callback`;
    const data = {
      grant_type: "authorization_code",
      code: code,
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_uri,
    }
    console.log(data);

    console.log("Posting to oauth/token...")
    try
    {
      const response = await axios.post('https://api.intra.42.fr/oauth/token', data);
      return response.data;
    } catch (e) {
      throw new Error('Erreur lors de l\'authentification : ' + e.message);
    }
  }
}
