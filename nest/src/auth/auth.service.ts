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
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

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

  // TODO: mettre dans ft.utils.ts ?
  async getTokenFt(code: string): Promise<any> {
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

    console.log("Posting to oauth/token...")
    try
    {
      const response = await axios.post('https://api.intra.42.fr/oauth/token', data);
      return response.data;
    } catch (e) {
      throw new Error('Erreur lors de l\'authentification : ' + e.message);
    }
  }

  async getProfileFt(token: string): Promise<any> {
    // !! 2 requests par secondes
    const auth_value = 'Bearer ' + token;

    console.log("Getting profile from api...")
    try {
      const profileResponse = await axios.get("https://api.intra.42.fr/v2/me",
          { headers: { 'Authorization': auth_value } });
      return profileResponse.data;
    } catch (error) {
      throw new Error('Erreur lors de la requete GET /v2/me (getProfileFt()) : ' + error.message);
    }
  }

  async loginFt(code: string) {
    const tokenData = await this.getTokenFt(code);
    const profileData = await this.getProfileFt(tokenData.access_token);

    const user = this.usersService.findOneByEmail(profileData.email);

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
