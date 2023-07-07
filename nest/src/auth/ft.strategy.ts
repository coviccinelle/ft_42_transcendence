// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { PassportStrategy } from "@nestjs/passport";
// import { Strategy } from "passport-42";
// import { domainName } from "src/main";
// import { CreateUserDto } from "src/users/dto/create-user.dto";
// import { UserEntity } from "src/users/entities/user.entity";
// import { UsersService } from "src/users/users.service";

// @Injectable()
// export class FtStrategy extends PassportStrategy(Strategy, 'ft') {
//   constructor(
//     private configService: ConfigService,
//     private usersService: UsersService,
//   ) {
//     super({
//       clientID: configService.get<string>('VITE_FT_CLIENT_ID'),
//       clientSecret: configService.get<string>('FT_CLIENT_SECRET'),
//       callbackURL: `http://${domainName}/api/auth/status`,
//     });
//   }

//   async validate(accessToken: string, refreshToken: string,
//                 profile: any, cb: any): Promise<UserEntity> {
//     console.log(profile);

//     const user = await this.usersService.findOneByEmail(profile.email);
//     if (user) {
//       console.log(user);
//       return user;
//     }
//     else { // If no user -> Create new user
//       const newUserDto: CreateUserDto = {
//         email: profile.emails[0].value,
//         firstName: profile.name.givenName,
//         lastName: profile.name.familyName,
//         picture: profile.photos[0].value,
//         password: null
//       };
//       console.log(newUserDto);
//       return this.usersService.create(newUserDto);
//     }
// }
// }
