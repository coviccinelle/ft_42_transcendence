import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  isGroup: boolean;

  @ApiProperty()
  isPublic: boolean;
}
