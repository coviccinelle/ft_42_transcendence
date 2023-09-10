import { ApiProperty } from '@nestjs/swagger';
import { $Enums, MatchResult } from '@prisma/client';

export class MatchResultEntity implements MatchResult {
  constructor(partial: Partial<MatchResultEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  playerId: number;

  @ApiProperty()
  result: $Enums.MatchStatus;

  @ApiProperty()
  otherPlayerId: number;

  @ApiProperty()
  otherPlayerName: string;

  @ApiProperty()
  myScore: number;

  @ApiProperty()
  otherScore: number;
}
