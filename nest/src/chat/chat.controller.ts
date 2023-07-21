import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChannelEntity } from './entities/channel.entity';
import { MessageEntity } from './entities/message.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('chat')
@ApiTags('chat')
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Get(':id/messages')
  @ApiOkResponse({ type: MessageEntity, isArray: true })
  async getMessages(@Param('id', ParseIntPipe) id: number) {
    return await this.chatService.getMessages(id);
  }

  @Post(':id/message')
  @ApiCreatedResponse({ type: MessageEntity })
  async sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return await this.chatService.postMessage(id, createMessageDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.chatService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
