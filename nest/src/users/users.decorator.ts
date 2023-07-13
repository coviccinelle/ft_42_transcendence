import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    console.log("user decorator used");
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    //TODO: check if no new image or make picture cache

    return data ? user?.[data] : user;
  },
);
