import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateChannelPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
