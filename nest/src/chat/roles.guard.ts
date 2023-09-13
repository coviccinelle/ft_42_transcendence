import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    let channelId = 0;
    let user: UserEntity;
    const request = context.getArgByIndex(0);
    if (context.getType() === 'http') {
      channelId = +request.params.id;
      user = request.user;
    } else if (context.getType() === 'ws') {
      channelId = context.switchToWs().getData<CreateMessageDto>().channelId;
      user = request.data.user;
    } else {
      console.log(`Unknown context type: ${context.getType()}`);
      return false;
    }
    if (!user) {
      return false;
    }
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    //If no channel is specified
    if (!Number.isInteger(channelId)) return !roles;
    const member = await this.prisma.member.findFirst({
      where: {
        userId: user.id,
        channelId: channelId,
      },
    });
    if (member && member.role === 'BANNED') return false;
    if (!roles) return true;
    if (!member) return false;
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
