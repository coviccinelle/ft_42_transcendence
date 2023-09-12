import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      return request.isAuthenticated();
    } else if (context.getType() === 'ws') {
      const request = context.getArgByIndex(0);
      return !!request.data.user;
    }
    return false;
  }
}
