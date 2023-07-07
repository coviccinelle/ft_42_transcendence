import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface MessageInterface {
  channel: string,
  text: string,
};

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection{
  @WebSocketServer() wss: Server;

  handleConnection(socket: Socket) {
    socket.join('general');
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: MessageInterface,
  ) {
    console.log(data.channel + ': ' + data.text);
    this.wss.in(data.channel).emit('message', data);
  }
  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() [ oldRoom, newRoom ],
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(oldRoom);
    socket.join(newRoom);
    console.log('Leaving ' + oldRoom);
    console.log('Joining ' + newRoom);
  }
}
