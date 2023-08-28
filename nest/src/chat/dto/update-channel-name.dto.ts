import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateChannelNameDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}