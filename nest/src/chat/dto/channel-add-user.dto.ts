import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class ChannelAddUserDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;
}
