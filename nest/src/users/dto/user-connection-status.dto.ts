import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum ConnectionState {
  DISCONNECTED,
  CONNECTED,
  PLAYING,
}

export class UserConnectionStatusDto {
  @ApiProperty({ enum: ConnectionState })
  @IsEnum(ConnectionState)
  status: ConnectionState;
}
