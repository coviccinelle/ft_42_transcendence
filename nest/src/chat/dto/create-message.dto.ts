import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '@prisma/client';
import { IsNotEmpty, IsString, IsInt, IsEnum } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ enum: MessageType })
  @IsEnum(MessageType)
  type: MessageType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsInt()
  @ApiProperty()
  channelId: number;
}
