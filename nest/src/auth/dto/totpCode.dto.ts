import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class TotpCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  code: string;
}
