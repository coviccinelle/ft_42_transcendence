import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import { compare } from 'bcrypt';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map, tap } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { domainName } from 'src/main';
import { response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly httpService: HttpService,
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

  async loginFt(code: string, state: string) {
    const client_secret = this.configService.get<string>('FT_CLIENT_SECRET');
    const client_id = this.configService.get<string>('FT_CLIENT_ID');
    const redirect_uri = `http://${domainName}/api/auth/status`;

    console.log("Posting to oauth/token...")
    const data = await lastValueFrom(
      this.httpService.post(
        'https://api.intra.42.fr/oauth/token',
        {
          grant_type: "authorization_code",
          client_id: client_id,
          client_secret: client_secret,
          code: code,
          redirect_uri: redirect_uri,
          state: state,
        }
      ).pipe(
        map((response) => {
          return response.data;
        }),
      ),
    );
    console.log(`result: ${data}`); // TODO: get response from post
    // return {
    //   accessToken: response.json,
    // };
  }
}
