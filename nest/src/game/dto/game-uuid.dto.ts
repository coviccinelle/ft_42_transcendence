import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class GameUuidDto {
  @IsUUID()
  @ApiProperty()
  uuid: string;
}
