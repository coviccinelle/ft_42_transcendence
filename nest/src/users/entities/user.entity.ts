import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty({ required: false, nullable: true })
  firstName: string;

  @ApiProperty({ required: false, nullable: true })
  lastName: string;

  @ApiProperty({ required: false, nullable: true })
  picture: string;

  @ApiProperty()
  isTwoFAEnabled: boolean;

  @Exclude()
  @ApiProperty({ required: false, nullable: true })
  twoFASecret: string;

  @Exclude()
  password: string;
}
