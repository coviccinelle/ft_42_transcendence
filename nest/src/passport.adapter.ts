import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import * as passport from 'passport';
import { INestApplicationContext } from '@nestjs/common';
import { RequestHandler } from 'express';

export default class PassportIoAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private sessionMiddleware: RequestHandler,
  ) {
    super(app);
  }
  createIOServer(port: number, options?: any): any {
    // convert a connect middleware to a Socket.IO middleware
    const wrap = (middleware) => (socket, next) =>
      middleware(socket.request, {}, next);
    const server: Server = super.createIOServer(port, options);
    server.of('chat').use(wrap(this.sessionMiddleware));
    server.of('chat').use(wrap(passport.initialize()));
    server.of('chat').use(wrap(passport.session()));
    return server;
  }
}
