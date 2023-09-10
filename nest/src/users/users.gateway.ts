import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const SESSION_RELOAD_INTERVAL = 30 * 1000;

@WebSocketGateway()
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  async handleConnection(client: any) {
    client.data.interval = setInterval(() => {
      client.conn.close();
    }, SESSION_RELOAD_INTERVAL);
    const user = client.request.user;
    if (!user) {
      return;
    }
    client.data.user = user;
  }

  async handleDisconnect(client: any) {
    clearInterval(client.data.interval);
  }

  async isUserConnected(userId: number) {
    const sockets = await this.wss.fetchSockets();
    if (sockets.find((socket) => socket.data.user?.id === userId)) return true;
    return false;
  }
}
