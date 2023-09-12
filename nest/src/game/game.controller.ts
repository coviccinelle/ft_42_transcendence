import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { GameUuidDto } from './dto/game-uuid.dto';

@Controller('game')
@ApiTags('game')
@UseGuards(AuthenticatedGuard)
@ApiBearerAuth()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('newGame')
  @ApiOkResponse({ type: GameUuidDto })
  newGame(): GameUuidDto {
    const game: GameUuidDto = {
      uuid: this.gameService.createPrivateGame(),
    };
    return game;
  }
}
