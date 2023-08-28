import { User } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { MemberEntity } from './member.entity';

export class UserMemberEntity implements User {
  constructor(partial: Partial<User>) {
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

  @Exclude()
  password: string;

  @ApiProperty()
  member: MemberEntity;
}
