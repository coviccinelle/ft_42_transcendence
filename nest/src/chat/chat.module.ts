import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [ChannelsModule],
  providers: [ChatGateway],
})
export class ChatModule {}
