import { Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('ranking')
@ApiTags('ranking')
export class RankingController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: Ranking mais faire jeu d'abord car besoin de savoir comment avoir les 2 joueurs
  // ? request avec 2 id (dans l'url)
  // ? request avec une "session de jeu" dans un cookie (comme user qui est renvoye a l'auth)
  // ? avec le socket

  @Get('leaderboard')
  async getLeaderboard() {}

  @Get('stats')
  async getStats() {}

  @Get('stats/rank')
  async getRank() {}

  @Get('stats/win')
  async getWin() {}

  @Get('stats/lose')
  async getLose() {}

  @Get('stats/ratio')
  async getRatio() {}

  @Patch('update')
  async updatePlayers(winer: UserEntity, loser: UserEntity) {}

  // @Patch('win')
  // async playerWin() {}

  // @Patch('lose')
  // async playerLose() {}
}
