import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class userIdDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;
}
