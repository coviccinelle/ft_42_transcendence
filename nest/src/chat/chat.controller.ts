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
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChannelEntity } from './entities/channel.entity';
import { MessageEntity } from './entities/message.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiCookieAuth,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from 'src/users/users.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

@Controller('chat')
@ApiTags('chat')
@UseGuards(RolesGuard)
// @ApiCookieAuth('connect.sid')
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiCreatedResponse({ type: ChannelEntity })
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.chatService.create(createChannelDto);
  }

  @Get()
  @ApiOkResponse({ type: ChannelEntity, isArray: true })
  findPublic() {
    return this.chatService.findPublic();
  }

  @Get('mychannels')
  @ApiOkResponse({ type: ChannelEntity, isArray: true })
  async getMyChannels(@User() user: UserEntity) {
    return await this.chatService.getMyChannels(user);
  }

  @Get(':id')
  @Roles('regular')
  @ApiOkResponse({ type: ChannelEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.findOne(id);
  }

  @Get(':id/messages')
  @Roles('regular')
  @ApiOkResponse({ type: MessageEntity, isArray: true })
  async getMessages(@Param('id', ParseIntPipe) id: number) {
    return await this.chatService.getMessages(id);
  }
  
  @Post(':id/message')
  @Roles('regular')
  @ApiCreatedResponse({ type: MessageEntity })
  async sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() createMessageDto: CreateMessageDto,
    @User() user: UserEntity,
  ) {
    return await this.chatService.postMessage(id, createMessageDto, user);
  }

  @Patch(':id')
  @Roles('owner')
  update(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return this.chatService.update(id, updateChannelDto);
  }

  @Delete(':id')
  @Roles('owner')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.remove(id);
  }
}
