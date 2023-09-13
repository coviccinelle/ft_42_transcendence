import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { ChatService } from 'src/chat/chat.service';
import { UserStatsDto } from './dto/user-stats.dto';
import { UsersGateway } from './users.gateway';
import { ConnectionState } from './dto/user-connection-status.dto';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';
import { GameGateway } from 'src/game/game.gateway';
import { errors, limits, validateEmail } from 'src/main';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private chatService: ChatService,
    private usersGateway: UsersGateway,
    private gameGateway: GameGateway,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    if (createUserDto.password) {
      if (createUserDto.password.length > limits.password) {
        return (errors[5]);
      }
      const hashedPassword = await hash(
        createUserDto.password,
        roundsOfHashing,
      );
      createUserDto.password = hashedPassword;
    }
    if (createUserDto.nickname && (createUserDto.nickname.length == 0 || createUserDto.nickname.length > limits.nickname)) {
      console.log("ERROR UPDATE user invalid new nickname");
      return errors[8];
    }
    else if (!createUserDto.nickname || createUserDto.nickname.length === 0 || this.findOneByNickname(createUserDto.nickname)) {
      let nickname: string = '';
      const customConfig: Config = {
        dictionaries: [adjectives, colors],
        separator: '-',
        length: 1,
      };

      do {
        nickname = uniqueNamesGenerator(customConfig) + "-" + Math.floor(9999 * Math.random()).toString();
      } while (!this.findOneByNickname(nickname));
      createUserDto.nickname = nickname;
    }
    if (!validateEmail(createUserDto.email)) {
      return errors[3];
    }
    if (!createUserDto.picture) {
      createUserDto.picture = 'https://i.pinimg.com/originals/a4/97/d7/a497d78803c0821e1f0cdb8b8b8a6d32.jpg';
    }
    // TODO: check picture is picture, size...

    const newUser = await this.prisma.user.create({ data: createUserDto });
    console.log('CREATING user ' + newUser.email);
    return newUser;
  }

  findAll(): any {
    return this.prisma.user.findMany();
  }

  findOneById(id: number): any {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findOneByEmail(email: string): any {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findOneByNickname(nickname: string): any {
    return this.prisma.user.findUnique({ where: { nickname } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    if (updateUserDto.password) {
      if (updateUserDto.password.length > limits.password) {
        return (errors[5]);
      }
      updateUserDto.password = await hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }
    // TODO: check if nickname is in db: || this.findOneByNickname(updateUserDto.nickname)
    if (updateUserDto.nickname && ((updateUserDto.nickname.length == 0 || updateUserDto.nickname.length > limits.nickname))) {
      console.log("ERROR UPDATE user invalid new nickname");
      return errors[8];
    }
    if (!updateUserDto.email || !validateEmail(updateUserDto.email)) {
      console.log("ERROR UPDATE user invalid email.");
      return errors[3];
    }
    if (!updateUserDto.picture) {
      updateUserDto.picture = 'https://i.pinimg.com/originals/a4/97/d7/a497d78803c0821e1f0cdb8b8b8a6d32.jpg';
    }
    // TODO: check picture

    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  async block(user: UserEntity, blockId: number): Promise<any> {
    if (user.id === blockId) {
      throw new HttpException('Can\'t block yourself', HttpStatus.FORBIDDEN);
    }
    const toBlock = await this.prisma.user.findUnique({
      where: { id: blockId },
    });
    if (!toBlock) {
      throw new HttpException('User doesn\'t exist', HttpStatus.NOT_FOUND);
    }
    //Delete DM channel
    const channel = await this.prisma.channel.findFirst({
      where: {
        isGroup: false,
        members: {
          every: {
            userId: { in: [user.id, blockId] },
          },
        },
      },
    });
    if (channel) {
      this.chatService.delete(channel.id);
    }
    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        blocked: {
          connect: { id: blockId },
        },
      },
    });
  }

  async unblock(user: UserEntity, blockId: number): Promise<any> {
    if (user.id === blockId) {
      throw new HttpException('Can\'t unblock yourself', HttpStatus.FORBIDDEN);
    }
    const toUnblock = await this.prisma.user.findUnique({
      where: { id: blockId },
      include: { blockedBy: true },
    });
    if (!toUnblock) {
      throw new HttpException('User doesn\'t exist', HttpStatus.NOT_FOUND);
    }
    const userIsBlocked = toUnblock.blockedBy.find((blockedByUser) => {
      return (blockedByUser.id === user.id);
    });
    if (userIsBlocked){
      return await this.prisma.user.update({
        where: { id: user.id },
        data: {
          blocked: {
            disconnect: { id: blockId },
          },
        },
      });
    }
    return user;
  }

  async getFriends(userId: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { friends: true },
    });
    return user.friends;
  }

  async addFriend(userId: number, friendId: number): Promise<any> {
    const friend = await this.prisma.user.findUnique({
      where: { id: friendId },
      include: { friendOf: true },
    });
    if (!friend) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (friend.friendOf.find((user) => user.id === userId)) return friend;
    return await this.prisma.user.update({
      where: { id: friendId },
      data: {
        friendOf: {
          connect: { id: userId },
        },
      },
    });
  }

  async removeFriend(userId: number, friendId: number): Promise<any> {
    const friend = await this.prisma.user.findUnique({
      where: { id: friendId },
      include: { friendOf: true },
    });
    if (!friend) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (!friend.friendOf.find((user) => user.id === userId)) return friend;
    return await this.prisma.user.update({
      where: { id: friendId },
      data: {
        friendOf: {
          disconnect: { id: userId },
        },
      },
    });
  }

  async getMatchHistory(userId: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { matchHistory: true },
    });
    if(!user) throw new NotFoundException('User doesn\'t exist');
    return user.matchHistory;
  }

  async getRank(elo: number): Promise<any> {
    const users = await this.prisma.user.findMany({
      where: {
        elo: { gt: elo },
      },
    });
    return (1 + users.length);
  }

  async getStats(userId: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User doesn\'t exist');
    const rank = await this.getRank(user.elo);
    const stats: UserStatsDto = {
      id: user.id,
      elo: user.elo,
      rank: rank,
    };
    return stats;
  }

  async getStatus(userId: number): Promise<any> {
    if (await this.gameGateway.isUserPlaying(userId)) {
      return { status: ConnectionState.PLAYING };
    }
    if (await this.usersGateway.isUserConnected(userId)) {
      return { status: ConnectionState.CONNECTED };
    }
    return { status: ConnectionState.DISCONNECTED };
  }

  async setTwoFASecret(userId: number, secret: string): Promise<any> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFASecret: secret,
      },
    });
  }

  async enableTwoFA(userId: number): Promise<any> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        isTwoFAEnabled: true,
      },
    });
  }

  async disableTwoFA(userId: number): Promise<any> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        isTwoFAEnabled: false,
      },
    });
  }

  async getIsBlocked(userId: number, blockedId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { blocked: true },
    });
    return (!!user.blocked.find((blockedUser) => blockedUser.id === blockedId));
  }

  async uploadAvatar(userId: number): Promise<any> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        picture: `/avatars/${userId}.jpeg`,
      },
    });
  }
}
