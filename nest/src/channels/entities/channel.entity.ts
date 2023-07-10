import { Channel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ChannelEntity implements Channel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  isGroup: boolean;
}
