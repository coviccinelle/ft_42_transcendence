import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TwoFAAuthGuard extends AuthGuard('twofa') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;
    const request = await context.switchToHttp().getRequest();

    await super.logIn(request);
    return activate;
  }
}
