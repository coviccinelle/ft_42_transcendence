import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private usersService: UsersService) {
    super();
  }

  serializeUser(user: UserEntity, done: Function) {
    done(null, user);
  }

  async deserializeUser(payload: UserEntity, done: Function) {
    const user = await this.usersService.findOneById(payload.id);
    return user ? done(null, user) : done(null, null);
  }
}
