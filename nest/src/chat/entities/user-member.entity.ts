import { User } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { MemberEntity } from './member.entity';

export class UserMemberEntity implements User {
  constructor(partial: Partial<UserMemberEntity>) {
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
  member: MemberEntity;

  @ApiProperty()
  isTwoFAEnabled: boolean;

  @ApiProperty({ required: false, nullable: true })
  twoFASecret: string;

  @Exclude()
  password: string;
}
