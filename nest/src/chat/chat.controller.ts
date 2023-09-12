import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelNameDto } from './dto/update-channel-name.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChannelEntity } from './entities/channel.entity';
import { MessageEntity } from './entities/message.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiCookieAuth,
  ApiBearerAuth,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { User } from 'src/users/users.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { UserIdDto } from '../users/dto/user-id.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { UserMemberEntity } from './entities/user-member.entity';
import { MuteUserDto } from './dto/mute-user.dto';
import { UpdateChannelPasswordDto } from './dto/update-channel-password.dto';
import { Channel } from '@prisma/client';

@Controller('chat')
@ApiTags('chat')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiCreatedResponse({ type: ChannelEntity })
  async create(
    @Body() createChannelDto: CreateChannelDto,
    @User() user: UserEntity,
  ) {
    return new ChannelEntity(await this.chatService.create(createChannelDto, user.id));
  }

  @Get()
  @ApiOkResponse({ type: ChannelEntity, isArray: true })
  async findPublic(@User() user: UserEntity) {
    const channels = await this.chatService.findPublic(user.id);
    return channels.map((channel) => new ChannelEntity(channel));
  }

  @Get('mychannels')
  @ApiOkResponse({ type: ChannelEntity, isArray: true })
  async getMyChannels(@User() user: UserEntity) {
    const channels = await this.chatService.getMyChannels(user);
    return channels.map((channel) => new ChannelEntity(channel));
  }

  @Post('join')
  @ApiCreatedResponse({ type: ChannelEntity })
  async joinChannel(
    @User() user: UserEntity,
    @Body() joinChannelDto: JoinChannelDto,
  ) {
    let res: any;
    res = await this.chatService.joinChannel(joinChannelDto, user);
    if (res.error) {
      return res;
    }
    return new ChannelEntity(res);
  }

  @Get(':id/leave')
  @HttpCode(204)
  @Roles('regular')
  @ApiNoContentResponse()
  async leaveChannel(
    @User   () user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.chatService.leaveChannel(id, user);
  }

  @Get(':id')
  @ApiOkResponse({ type: ChannelEntity })
  @Roles('regular')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new ChannelEntity(await this.chatService.findOne(id));
  }

  @Post('newDM')
  @ApiCreatedResponse()
  async openDM(
    @Body() other: UserIdDto,
    @User() user: UserEntity,
  ) {
    return new ChannelEntity(await this.chatService.openDM(user, other.id));
  }

  @Get(':id/users')
  @ApiOkResponse({ type: UserMemberEntity, isArray: true })
  @Roles('regular')
  async getUsers(@Param('id', ParseIntPipe) id: number) {
    const users = await this.chatService.getUsers(id);
    return users.map((user) => new UserMemberEntity(user));
  }

  @Get(':id/messages')
  @ApiOkResponse({ type: MessageEntity, isArray: true })
  @Roles('regular')
  async getMessages(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ) {
    return await this.chatService.getMessages(id, user.id);
  }

  @Post(':id/message')
  @ApiCreatedResponse({ type: MessageEntity })
  @Roles('regular')
  async sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() createMessageDto: CreateMessageDto,
    @User() user: UserEntity,
  ) {
    return await this.chatService.postMessage(id, createMessageDto, user);
  }

  @Patch(':id/name')
  @ApiOkResponse({ type: ChannelEntity })
  @Roles('admin')
  async updateName(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChannelNameDto: UpdateChannelNameDto,
  ) {
    return new ChannelEntity(await this.chatService.updateName(id, updateChannelNameDto));
  }

  @Post(':id/kick')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  kickUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UserIdDto,
  ) {
    this.chatService.kickUser(id, user.id);
  }

  @Post(':id/ban')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  async banUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UserIdDto,
  ) {
    await this.chatService.banUser(id, user.id);
  }

  @Post(':id/unban')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  unbanUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UserIdDto,
  ) {
    this.chatService.unbanUser(id, user.id);
  }

  @Post(':id/promoteAdmin')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  async promoteUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UserIdDto,
  ) {
    await this.chatService.promoteUser(id, user.id);
  }

  @Post(':id/demoteAdmin')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  async demoteUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UserIdDto,
  ) {
    await this.chatService.demoteUser(id, user.id);
  }

  @Post(':id/mute')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  async muteUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() muteUserDto: MuteUserDto,
  ) {
    await this.chatService.muteUser(id, muteUserDto);
  }

  @Post(':id/unmute')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  async unmuteUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() muteUserDto: MuteUserDto,
  ) {
    await this.chatService.unmuteUser(id, muteUserDto);
  }

  @Patch(':id/adduser')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  async addUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() channelAddUserDto: UserIdDto,
    @User() user: UserEntity,
  ) {
    await this.chatService.addUser(id, channelAddUserDto.id, user);
  }

  @Patch(':id/password')
  @ApiOkResponse({ type: ChannelEntity})
  @Roles('owner')
  async updatePassword(
    @Param('id', ParseIntPipe) channelId: number,
    @Body() updateChannelPasswordDto: UpdateChannelPasswordDto,
  ) {
    return new ChannelEntity(await this.chatService.updatePassword(channelId, updateChannelPasswordDto.password));
  }

  @Patch(':id/owner')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('owner')
  async transferOwnership(
    @Param('id', ParseIntPipe) channelId: number,
    @Body() user: UserIdDto,
    @User() owner: UserEntity,
  ) {
    await this.chatService.transferOwnership(channelId, owner, user.id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('owner')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.chatService.delete(id);
  }
}
