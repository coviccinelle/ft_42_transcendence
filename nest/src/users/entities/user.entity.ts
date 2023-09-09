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

  @ApiProperty({ required: false, nullable: true })
  firstName: string;

  @ApiProperty({ required: false, nullable: true })
  lastName: string;

  @ApiProperty({ required: false, nullable: true })
  picture: string;

  @ApiProperty()
  elo: number;

  @Exclude()
  password: string;
}
