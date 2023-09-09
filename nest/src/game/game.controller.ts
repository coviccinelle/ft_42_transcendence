import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

@Controller('game')
@ApiTags('game')
@UseGuards(AuthenticatedGuard)
@ApiBearerAuth()
export class GameController {
  constructor(private readonly gameService: GameService) {}


}
