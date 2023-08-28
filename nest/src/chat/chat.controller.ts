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
import { userIdDto } from '../users/dto/user-id.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { UserMemberEntity } from './entities/user-member.entity';
import { MuteUserDto } from './dto/mute-user.dto';
import { UpdateChannelPasswordDto } from './dto/update-channel-password.dto';

@Controller('chat')
@ApiTags('chat')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiCreatedResponse({ type: ChannelEntity })
  create(
    @Body() createChannelDto: CreateChannelDto,
    @User() user: UserEntity,
  ) {
    return this.chatService.create(createChannelDto, user.id);
  }

  @Get()
  @ApiOkResponse({ type: ChannelEntity, isArray: true })
  findPublic(@User() user: UserEntity) {
    return this.chatService.findPublic(user.id);
  }

  @Get('mychannels')
  @ApiOkResponse({ type: ChannelEntity, isArray: true })
  getMyChannels(@User() user: UserEntity) {
    return this.chatService.getMyChannels(user);
  }

  @Post('join')
  @ApiCreatedResponse({ type: ChannelEntity })
  async joinChannel(
    @User() user: UserEntity,
    @Body() joinChannelDto: JoinChannelDto,
  ) {
    return await this.chatService.joinChannel(joinChannelDto, user);
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.findOne(id);
  }

  @Post('newDM')
  @ApiCreatedResponse()
  async openDM(
    @Body() other: userIdDto,
    @User() user: UserEntity,
  ) {
    return await this.chatService.openDM(user, other.id);
  }

  @Get(':id/users')
  @ApiOkResponse({ type: UserMemberEntity })
  @Roles('regular')
  getUsers(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.getUsers(id);
  }

  @Get(':id/messages')
  @ApiOkResponse({ type: MessageEntity, isArray: true })
  @Roles('regular')
  async getMessages(@Param('id', ParseIntPipe) id: number) {
    return await this.chatService.getMessages(id);
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
    return await this.chatService.updateName(id, updateChannelNameDto);
  }

  @Post(':id/kick')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  kickUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: userIdDto,
  ) {
    this.chatService.kickUser(id, user.id);
  }

  @Post(':id/ban')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  async banUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: userIdDto,
  ) {
    await this.chatService.banUser(id, user.id);
  }

  @Post(':id/unban')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  unbanUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: userIdDto,
  ) {
    this.chatService.unbanUser(id, user.id);
  }

  @Post(':id/promoteAdmin')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  async promoteUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: userIdDto,
  ) {
    await this.chatService.promoteUser(id, user.id);
  }

  @Post(':id/demoteAdmin')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  async demoteUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: userIdDto,
  ) {
    await this.chatService.demoteUser(id, user.id);
  }

  @Post(':id/mute')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  async muteUser(
    @Param(':id', ParseIntPipe) id: number,
    @Body() muteUserDto: MuteUserDto,
  ) {
    await this.chatService.muteUser(id, muteUserDto);
  }

  @Post(':id/unmute')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  async unmuteUser(
    @Param(':id', ParseIntPipe) id: number,
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
    @Body() channelAddUserDto: userIdDto,
  ) {
    await this.chatService.addUser(id, channelAddUserDto.id);
  }

  @Patch(':id/password')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('owner')
  updatePassword(
    @Param('id', ParseIntPipe) channelId: number,
    @Body() updateChannelPasswordDto: UpdateChannelPasswordDto,
  ) {
    this.chatService.updatePassword(channelId, updateChannelPasswordDto.password);
  }

  @Patch(':id/owner')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('owner')
  async transferOwnership(
    @Param('id', ParseIntPipe) channelId: number,
    @Body() user: userIdDto,
    @User() owner: UserEntity,
  ) {
    await this.chatService.transferOwnership(channelId, owner, user.id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('owner')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.chatService.remove(id);
  }
}
