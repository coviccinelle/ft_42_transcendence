import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  redirectFromApi(@Res() res): string {
    return res.redirect('/');
  }
}
