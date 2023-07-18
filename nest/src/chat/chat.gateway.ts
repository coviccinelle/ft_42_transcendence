import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer() wss: Server;

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() channelId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(channelId.toString());
    console.log('joined channel', channelId);
  }

  broadcastMessage(content: string, authorId: number, channelId: number) {
    this.wss
      .in(channelId.toString())
      .emit('message', { content, authorId, channelId });
    console.log('broadcasted message', content, authorId, channelId);
  }
}
