import { v4 as uuidv4 } from 'uuid';
import { GameGateway } from './game.gateway';

const updateDelay = 10;

export enum Direction {
  NONE,
  UP,
  DOWN,
}

export enum GameStatus {
  WAITING,
  PLAYING,
  FINISHED,
}

export type Vector2d = {
  x: number,
  y: number,
}

export type Ball = {
  position: Vector2d,
  velocity: Vector2d,
  size: number,
}

export type Paddle = {
  position: number;
  size: number;
  movement: Direction;
}

export type Player = {
  id: number;
  paddle: Paddle;
  name: string;
  score: number;
}

export type GameInfo = {
  id: string;
  status: GameStatus;
  courtSize: Vector2d;
  ball: Ball;
  players: Player[];
}

export class Game {
  private id: string;
  private status: GameStatus;
  private updateInterval: NodeJS.Timer;
  private courtSize: Vector2d;
  private paddleSpeed: number;
  private ballInitialSpeed: number;
  private pointsToWin: number;
  private ball: Ball;
  private players: Player[];
  private nbPlayers: number;

  constructor(
    private gameGateway: GameGateway,
    private isPublic: boolean,
  ) {
    this.id = uuidv4();
    this.nbPlayers = 0;
    this.status = GameStatus.WAITING;
    this.courtSize.x = 2000;
    this.courtSize.y = 900;
    this.paddleSpeed = 10;
    this.ballInitialSpeed = 5;
    this.pointsToWin = 5;
    this.ball.position.x = this.courtSize.x / 2;
    this.ball.position.y = this.courtSize.y / 2;
    this.ball.velocity.y = 0;
    this.players[0].paddle.position = this.courtSize.y / 2;
    this.players[1].paddle.position = this.courtSize.y / 2;
    this.players[0].paddle.size = 200;
    this.players[1].paddle.size = 200;
    this.players[0].paddle.movement = Direction.NONE;
    this.players[1].paddle.movement = Direction.NONE;
    this.players[0].score = 0;
    this.players[1].score = 0;
  }

  public getId(): string {
    return this.id;
  }

  public getIsPublic(): boolean {
    return this.isPublic;
  }

  public getStatus(): GameStatus {
    return this.status;
  }

  public getPlayerIds(): [number, number] {
    return [this.players[0].id, this.players[1].id];
  }

  public broadcastState() {
    this.gameGateway.broadcastInfo(this.id, this.getInfo());
  }

  public playerInput(userId: number, direction: Direction) {
    if (this.players[0].id === userId) {
      this.players[0].paddle.movement = direction;
    } else {
      this.players[1].paddle.movement = direction;
    }
  }

  public addPlayer(name: string, id: number) {
    if ((this.nbPlayers === 1) && (this.players[0].id === id)) {
      console.log('User joined game with themselves');
      return;
    }
    this.players[this.nbPlayers].name = name;
    this.players[this.nbPlayers].id = id;
    this.nbPlayers++;
    if (this.nbPlayers === 2) this.start();
  }
  
  public removePlayer(userId: number) {
    //TODO
  }
  
  private start() {
    this.status = GameStatus.PLAYING;
    this.launchBall();
    this.broadcastState();
    this.updateInterval = setInterval(this.update, updateDelay);
  }

  private startRound() {
    this.launchBall();
  }

  private endGame() {
    this.status = GameStatus.FINISHED;
    clearInterval(this.updateInterval);
    let winnerId: number;
    if (this.players[0].score === this.pointsToWin) {
      winnerId = this.players[0].id;
    } else {
      winnerId = this.players[1].id;
    }
    this.gameGateway.broadcastWinner(this.id, winnerId);
  }

  private updateBall() {
    this.ball.position.x += this.ball.velocity.x;
    this.ball.position.y += this.ball.velocity.y;
    //Collision in y direction
    if (this.ball.position.y - this.ball.size < 0) {
      const overTravel = this.ball.size - this.ball.position.y
      this.ball.position.y += 2 * overTravel;
      this.ball.velocity.y *= -1;
    }
    if (this.ball.position.y + this.ball.size > this.courtSize.y) {
      const overTravel = this.ball.position.y - this.ball.size - this.courtSize.x;
      this.ball.position.y -= 2 * overTravel;
      this.ball.velocity.y *= -1;
    }
    //Out of court in x direction
    if (this.ball.position.x - this.ball.size < 0) {
      if (this.ballIsCaught(0)) {
        const overTravel = this.ball.size - this.ball.position.x
        this.ball.position.x += 2 * overTravel;
        this.ball.velocity.x *= -1;
        //Todo: add spin
      } else {
        this.players[1].score += 1;
        if (this.players[1].score === this.pointsToWin) {
          this.endGame();
          return;
        }
        this.startRound();
      }
    }
    if (this.ball.position.x + this.ball.size > this.courtSize.x) {
      if (this.ballIsCaught(1)) {
        const overTravel = this.ball.position.x - this.ball.size - this.courtSize.x;
        this.ball.position.x -= 2 * overTravel;
        this.ball.velocity.x *= -1;
        //Todo: add spin
      } else {
        this.players[0].score += 1;
        if (this.players[0].score === this.pointsToWin) {
          this.endGame();
          return;
        }
        this.startRound();
      }
    }
  }

  private updatePaddles() {
    this.players.forEach(player => {
      if (player.paddle.movement !== Direction.NONE) {
        if (player.paddle.movement === Direction.UP) {
          player.paddle.position -= this.paddleSpeed;
          if (player.paddle.position < player.paddle.size / 2) {
            player.paddle.position = player.paddle.size / 2;
            player.paddle.movement = Direction.NONE;
          }
        }
        if (player.paddle.movement === Direction.DOWN) {
          player.paddle.position += this.paddleSpeed;
          if (player.paddle.position > this.courtSize.y - player.paddle.size / 2) {
            player.paddle.position = this.courtSize.y - player.paddle.size / 2;
            player.paddle.movement = Direction.NONE;
          }
        }
      }
    });
  }

  private getInfo(): GameInfo {
    let info: GameInfo;
    info.id = this.id;
    info.status = this.status;
    info.courtSize = this.courtSize;
    info.ball = this.ball;
    info.players = this.players;
    return (info);
  }

  private update() {
    this.updatePaddles();
    this.updateBall();
    this.broadcastState();
  }

  private ballIsCaught(playerNb: number): boolean {
    const topEdgePaddle = this.players[playerNb].paddle.position
      - this.players[playerNb].paddle.size / 2;
    const bottomEdgePaddle = this.players[playerNb].paddle.position
      + this.players[playerNb].paddle.size / 2;
    const topEdgeBall = this.ball.position.y - this.ball.size;
    const bottomEdgeBall = this.ball.position.y + this.ball.size;
    const ballIsAbovePaddle = (topEdgeBall < topEdgePaddle
      && bottomEdgeBall < topEdgePaddle);
    const ballIsBellowPaddle = (topEdgeBall > bottomEdgePaddle
      && bottomEdgeBall > bottomEdgePaddle);
    return (!ballIsAbovePaddle && !ballIsBellowPaddle);
  }

  private launchBall() {
    const angle = (Math.random() - 0.5) * Math.PI / 12; //Angle between +15 -15°
    this.ball.velocity.x = Math.floor(Math.cos(angle) * this.ballInitialSpeed);
    this.ball.velocity.y = Math.floor(Math.sin(angle) * this.ballInitialSpeed);
    if ((this.players[0].score + this.players[1].score) % 2) {
      this.ball.velocity.x *= -1;
    }
  }
}
