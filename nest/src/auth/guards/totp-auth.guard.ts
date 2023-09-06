import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TotpAuthGuard extends AuthGuard('totp') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;
    const request = await context.switchToHttp().getRequest();

    if (request.user.isTwoFAEnabled) {
      await super.logIn(request);
    }
    return activate;
  }
}
