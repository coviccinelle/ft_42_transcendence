import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class MuteUserDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  time: number;
}
