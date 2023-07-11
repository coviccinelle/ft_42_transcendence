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
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChannelEntity } from './entities/channel.entity';
import { MessageEntity } from './entities/message.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('channels')
@ApiTags('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  @ApiCreatedResponse({ type: ChannelEntity })
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelsService.create(createChannelDto);
  }

  @Get()
  @ApiOkResponse({ type: ChannelEntity, isArray: true })
  findPublic() {
    return this.channelsService.findPublic();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(+id);
  }

  @Get(':id/messages')
  @ApiOkResponse({ type: MessageEntity, isArray: true })
  async getMessages(@Param('id', ParseIntPipe) id : number) {
    return await this.channelsService.getMessages(id);
  }

  @Post(':id/message')
  @ApiCreatedResponse({ type: MessageEntity })
  async sendMessage(
    @Param('id', ParseIntPipe) id : number,
    @Body() createMessageDto : CreateMessageDto
    ) {
    return await this.channelsService.postMessage(id, createMessageDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelsService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelsService.remove(+id);
  }
}
