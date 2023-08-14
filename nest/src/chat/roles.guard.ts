import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const channelId = request.params.id;
    const members = await this.prisma.member.findMany({
      where: {
        userId: user.id,
        channelId: channelId,
      },
    });
    if (members.length === 0) {
      return false;
    }
    if (members.length > 1) {
      console.log('More than one member for given user and channel');
    }
    const userRole = members[0].role;
    for (const requiredRole of roles) {
      if (requiredRole === 'owner' && userRole !== 'OWNER') {
        return false;
      }
      if (
        requiredRole === 'admin' &&
        userRole !== 'OWNER' &&
        userRole !== 'ADMIN'
      ) {
        return false;
      }
      if (requiredRole === 'regular' && userRole === 'LEFT') {
        return false;
      }
    }
    return true;
  }
}
