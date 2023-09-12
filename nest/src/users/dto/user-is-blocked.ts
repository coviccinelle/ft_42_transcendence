import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UserIsBlockedDto {
  @ApiProperty()
  @IsBoolean()
  isBlocked: boolean;
}
