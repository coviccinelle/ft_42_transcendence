import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from 'src/users/entities/user.entity';

export class AuthEntity {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  msg: string;

  @ApiProperty()
  user: UserEntity;
}
