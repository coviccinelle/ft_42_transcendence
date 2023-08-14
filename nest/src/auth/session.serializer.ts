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
    console.log('Serialize User.');
    done(null, user);
  }

  async deserializeUser(payload: UserEntity, done: Function) {
    const user = await this.usersService.findOneById(payload.id);
    console.log('Deserialize User.');
    return user ? done(null, user) : done(null, null);
  }
}
