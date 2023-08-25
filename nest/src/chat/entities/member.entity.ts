import { Member, Role } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class MemberEntity implements Member {
  constructor(partial: Partial<Member>) {
    Object.assign(this, partial);
  }
  
  @ApiProperty()
  id: number;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  channelId: number;
}
