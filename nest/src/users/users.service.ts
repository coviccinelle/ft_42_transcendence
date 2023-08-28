import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';
import { connect } from 'http2';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password) {
      const hashedPassword = await hash(
        createUserDto.password,
        roundsOfHashing,
      );
      createUserDto.password = hashedPassword;
    }
    const newUser = await this.prisma.user.create({ data: createUserDto });
    //Auto join general channel
    await this.prisma.member.create({
      data: {
        role: 'REGULAR',
        user: {
          connect: { id: newUser.id },
        },
        channel: {
          connect: { id: 1 },
        },
      },
    });
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
}
