import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  create(createChannelDto: CreateChannelDto) {
    return `This action adds a new channel named ${createChannelDto.name}`;
  }

  findPublic() {
    return this.prisma.channel.findMany({
      where: { isPublic: true },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} channel`;
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel named ${updateChannelDto.name}`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
