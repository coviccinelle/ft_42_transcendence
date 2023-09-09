import { Injectable } from '@nestjs/common';
import { GameGateway } from './game.gateway';

@Injectable()
export class GameService {
  constructor(private readonly gameGateway: GameGateway) {}

  
}
