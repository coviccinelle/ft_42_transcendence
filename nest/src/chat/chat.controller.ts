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
import { ChannelAddUserDto } from './dto/channel-add-user.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { UserMemberEntity } from './entities/user-member.entity';

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
  joinChannel(
    @User() user: UserEntity,
    @Body() joinChannelDto: JoinChannelDto,
  ) {
    return this.chatService.joinChannel(joinChannelDto, user);
  }

  @Get(':id/leave')
  @HttpCode(204)
  @ApiNoContentResponse()
  leaveChannel(
    @User   () user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.chatService.leaveChannel(id, user);
  }

  @Get(':id')
  @ApiOkResponse({ type: ChannelEntity })
  @Roles('regular')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.findOne(id);
  }

  @Post('newDM')
  @ApiCreatedResponse()
  openDM(
    @Body() otherId: number,
    @User() user: UserEntity,
  ) {
    return this.chatService.openDM(user, otherId);
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
  updateName(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChannelNameDto: UpdateChannelNameDto,
  ) {
    return this.chatService.updateName(id, updateChannelNameDto);
  }

  @Post(':id/kick')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  kickUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userId: number,
  ) {
    this.chatService.kickUser(id, userId);
  }

  @Post(':id/ban')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  banUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userId: number,
  ) {
    this.chatService.banUser(id, userId);
  }

  @Post(':id/unban')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  unbanUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userId: number,
  ) {
    this.chatService.unbanUser(id, userId);
  }

  @Post(':id/promoteAdmin')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  promoteUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userId: number,
  ) {
    this.chatService.promoteUser(id, userId);
  }

  @Post(':id/demoteAdmin')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  demoteUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userId: number,
  ) {
    this.chatService.demoteUser(id, userId);
  }

  @Patch(':id/adduser')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('admin')
  async addUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() channelAddUserDto: ChannelAddUserDto,
  ) {
    this.chatService.addUser(id, channelAddUserDto.id);
  }

  @Patch(':id/owner')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('owner')
  transferOwnership(
    @Param('id', ParseIntPipe) channelId: number,
    @Body() userId: number,
    @User() owner: UserEntity,
  ) {
    this.chatService.transferOwnership(channelId, owner, userId);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Roles('owner')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.chatService.remove(id);
  }
}
