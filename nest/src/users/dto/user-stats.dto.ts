import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class UserStatsDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  elo: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  rank: number;
}
