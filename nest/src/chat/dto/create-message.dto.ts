import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  authorId: number;
}
