import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class JoinChannelDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password: string;
}
