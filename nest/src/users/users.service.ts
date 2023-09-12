import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private chatService: ChatService,
    private usersGateway: UsersGateway,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password) {
      const hashedPassword = await hash(
        createUserDto.password,
        roundsOfHashing,
      );
      createUserDto.password = hashedPassword;
    }
    // if (!createUserDto.nickname || createUserDto.nickname.length === 0) {
    //   let nickname: string = '';
    //   const customConfig: Config = {
    //     dictionaries: [adjectives, colors],
    //     separator: '-',
    //     length: 3,
    //   };

    //   do {
    //     nickname = uniqueNamesGenerator(customConfig) + "-" + Math.floor(9999 * Math.random()).toString();
    //   } while (!this.findOneByNickname(nickname));
    //   createUserDto.nickname = nickname;
    // }

    const newUser = await this.prisma.user.create({ data: createUserDto });
    return newUser;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOneById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findOneByNickname(nickname: string) {
    return this.prisma.user.findUnique({ where: { nickname } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async block(user: UserEntity, blockId: number) {
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

  async unblock(user: UserEntity, blockId: number) {
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

  async getFriends(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { friends: true },
    });
    return user.friends;
  }

  async addFriend(userId: number, friendId: number) {
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

  async removeFriend(userId: number, friendId: number) {
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

  async getMatchHistory(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { matchHistory: true },
    });
    if(!user) throw new NotFoundException('User doesn\'t exist');
    return user.matchHistory;
  }

  async getRank(elo: number) {
    const users = await this.prisma.user.findMany({
      where: {
        elo: { gt: elo },
      },
    });
    return (1 + users.length);
  }

  async getStats(userId: number) {
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

  async getStatus(userId: number) {
    //TODO: check if user is in game
    if (await this.usersGateway.isUserConnected(userId)) {
      return { status: ConnectionState.CONNECTED };
    }
    return { status: ConnectionState.DISCONNECTED };
  }

  async setTwoFASecret(userId: number, secret: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFASecret: secret,
      },
    });
  }

  async enableTwoFA(userId: number) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        isTwoFAEnabled: true,
      },
    });
  }

  async disableTwoFA(userId: number) {
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
}
