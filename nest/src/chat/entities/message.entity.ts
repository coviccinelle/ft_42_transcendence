import { Message } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Timestamp } from 'rxjs';
import { UserEntity } from 'src/users/entities/user.entity';

class Member {
  @ApiProperty({ type: UserEntity })
  user: UserEntity;
}

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

  @ApiPropertyOptional({ type: Member })
  author?: Member;
}
