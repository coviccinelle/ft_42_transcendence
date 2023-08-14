import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
		const user = request.user;
		if (!request.isAuthenticated() || !user) {
			return false;
		}
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
			return true;
		}
    const channelId = +request.params.id;
    const member = await this.prisma.member.findFirst({
      where: {
        userId: user.id,
        channelId: channelId,
      },
    });
    if (!member) {
      return false;
    }
    const userRole = member.role;
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
