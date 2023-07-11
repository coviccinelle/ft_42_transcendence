import { Message } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from 'rxjs';

export class MessageEntity implements Message {
  constructor(partial: Partial<Message>) {
    Object.assign(this, partial);
  }
  
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  channelId: number;
}
