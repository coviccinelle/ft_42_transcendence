import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';
import { connect } from 'http2';
import { UserEntity } from './entities/user.entity';
import { ChatService } from 'src/chat/chat.service';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private chatService: ChatService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password) {
      const hashedPassword = await hash(
        createUserDto.password,
        roundsOfHashing,
      );
      createUserDto.password = hashedPassword;
    }
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

}
