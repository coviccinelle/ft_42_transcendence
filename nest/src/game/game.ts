import { v4 as uuidv4 } from 'uuid';
import { GameGateway } from './game.gateway';
import { PrismaService } from 'src/prisma/prisma.service';

const updateDelay = 10;
const startDelay = 500;

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
  speed: number;
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
  private startInterval: NodeJS.Timer;
  private courtSize: Vector2d;
  private paddleMaxSpeed: number;
  private paddleMinSize: number;
  private ballInitialSpeed: number;
  private ballMaxSpeed: number;
  private pointsToWin: number;
  private ball: Ball;
  private players: Player[];
  private nbPlayers: number;

  constructor(
    private gameGateway: GameGateway,
    private prismaService: PrismaService,
    private isPublic: boolean,
    private isHard: boolean,
  ) {
    this.id = uuidv4();
    this.nbPlayers = 0;
    this.status = GameStatus.WAITING;
    this.courtSize = {
      x: 2000,
      y: 900,
    };
    this.ballInitialSpeed = 5;
    this.pointsToWin = 5;
    this.ball = {
      position: {
        x: this.courtSize.x / 2,
        y: this.courtSize.y / 2,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      size: 5,
    };
    this.players = new Array();
    for (let i = 0; i < 2; i++) {
      this.players.push({
        paddle: {
          position: this.courtSize.y / 2,
          size: 200,
          speed: 10,
          movement: Direction.NONE,
        },
        score: 0,
        id: 0,
        name: '',
      });
    }
  }

  public getId(): string {
    return this.id;
  }

  public getIsPublic(): boolean {
    return this.isPublic;
  }

  public getIsHard(): boolean {
    return this.isHard;
  }

  public getStatus(): GameStatus {
    return this.status;
  }

  public getPlayerIds(): [number, number] {
    return [this.players[0].id, this.players[1].id];
  }

  public getNbPlayers(): number {
    return this.nbPlayers;
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
    if (this.nbPlayers === 2) {
      this.startInterval = setInterval(() => this.start(), startDelay);
    }
  }
  
  public async removePlayer(userId: number) {
    if (this.status === GameStatus.PLAYING) {
      if (this.players[0].id === userId) {
        this.players[1].score = this.pointsToWin;
      } else {
        this.players[0].score = this.pointsToWin;
      }
      if (this.players[0].id !== -1 && this.players[1].id !== -1) {
        await this.endGame();
      }
    }
    if (this.players[0].id === userId) {
      this.players[0].id = -1;
    } else {
      this.players[1].id = -1;
    }
    this.nbPlayers--;
  }
  
  private start() {
    if (this.startInterval) {
      clearInterval(this.startInterval);
    }
    this.status = GameStatus.PLAYING;
    this.gameGateway.broadcastStart(this.id);
    this.launchBall();
    this.broadcastState();
    this.updateInterval = setInterval(() => this.update(), updateDelay);
  }

  private startRound() {
    this.launchBall();
  }

  private async endGame() {
    this.status = GameStatus.FINISHED;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    let winnerId: number;
    if (this.players[0].score === this.pointsToWin) {
      winnerId = this.players[0].id;
    } else {
      winnerId = this.players[1].id;
    }
    this.gameGateway.broadcastWinner(this.id, winnerId);
    await this.addMatchToHistory();
    await this.updateElo();
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
      const overTravel = this.ball.position.y + this.ball.size - this.courtSize.y;
      this.ball.position.y -= 2 * overTravel;
      this.ball.velocity.y *= -1;
    }
    //Out of court in x direction
    if (this.ball.position.x - this.ball.size < 0) {
      if (this.ballIsCaught(0)) {
        const overTravel = this.ball.size - this.ball.position.x
        this.ball.position.x += 2 * overTravel;
        this.ball.velocity.x *= -1;
        if (this.isHard) this.makeHarder(0);
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
        const overTravel = this.ball.position.x + this.ball.size - this.courtSize.x;
        this.ball.position.x -= 2 * overTravel;
        this.ball.velocity.x *= -1;
        if (this.isHard) this.makeHarder(0);
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
          player.paddle.position -= player.paddle.speed;
          if (player.paddle.position < player.paddle.size / 2) {
            player.paddle.position = player.paddle.size / 2;
            player.paddle.movement = Direction.NONE;
          }
        }
        if (player.paddle.movement === Direction.DOWN) {
          player.paddle.position += player.paddle.speed;
          if (player.paddle.position > this.courtSize.y - player.paddle.size / 2) {
            player.paddle.position = this.courtSize.y - player.paddle.size / 2;
            player.paddle.movement = Direction.NONE;
          }
        }
      }
    });
  }

  private getInfo(): GameInfo {
    let info: GameInfo = {
      id: this.id,
      status: this.status,
      courtSize: this.courtSize,
      ball: this.ball,
      players: this.players,
    };
    return (info);
  }

  private update() {
    this.updatePaddles();
    this.updateBall();
    this.broadcastState();
  }

  private ballIsCaught(playerNb: number): boolean {
    //This method is very unreliable for high angles and slow update cycles
    //Todo draw a line intercept to see if it crosses paddle
    const topEdgePaddle = this.players[playerNb].paddle.position
      - this.players[playerNb].paddle.size / 2;
    const bottomEdgePaddle = this.players[playerNb].paddle.position
      + this.players[playerNb].paddle.size / 2;
    const topEdgeBall = this.ball.position.y - this.ball.size;
    const bottomEdgeBall = this.ball.position.y + this.ball.size;
    const ballIsAbovePaddle = (bottomEdgeBall < topEdgePaddle);
    const ballIsBellowPaddle = (topEdgeBall > bottomEdgePaddle);
    return (!ballIsAbovePaddle && !ballIsBellowPaddle);
  }

  private makeHarder(playerNb: number) {
    const ballSpeed = Math.sqrt(Math.pow(this.ball.velocity.x, 2)
      + Math.pow(this.ball.velocity.y, 2));
    if (ballSpeed < this.ballMaxSpeed) {
      this.ball.velocity.x *= 1.05;
      this.ball.velocity.y *= 1.05;
    }
    if (this.players[playerNb].paddle.size > this.paddleMinSize) {
      this.players[playerNb].paddle.size *= 0.95;
    }
    if (this.players[playerNb].paddle.speed < this.paddleMaxSpeed) {
      this.players[playerNb].paddle.speed *= 1.05;
    }
  }

  private launchBall() {
    this.ball.position.x = this.courtSize.x / 2;
    this.ball.position.y = this.courtSize.y / 2;
    const angle = (Math.random() - 0.5) * Math.PI / 12.0; //Angle between +15 -15°
    this.ball.velocity.x = Math.cos(angle) * this.ballInitialSpeed;
    this.ball.velocity.y = Math.sin(angle) * this.ballInitialSpeed;
    if ((this.players[0].score + this.players[1].score) % 2) {
      this.ball.velocity.x *= -1;
    }
  }

  async addMatchToHistory() {
    await this.prismaService.matchResult.create({
      data: {
        player: {
          connect: { id: this.players[0].id },
        },
        result: (this.players[0].score === this.pointsToWin) ? 'WIN' : 'LOSS',
        otherPlayerId: this.players[1].id,
        otherPlayerName: this.players[1].name,
        myScore: this.players[0].score,
        otherScore: this.players[1].score,
      }
    });
    await this.prismaService.matchResult.create({
      data: {
        player: {
          connect: { id: this.players[1].id },
        },
        result: (this.players[1].score === this.pointsToWin) ? 'WIN' : 'LOSS',
        otherPlayerId: this.players[0].id,
        otherPlayerName: this.players[0].name,
        myScore: this.players[1].score,
        otherScore: this.players[0].score,
      }
    });
  }

  async updateElo() {
    const kFactor = 32;
    const player1 = await this.prismaService.user.findUnique({
      where: { id: this.players[0].id },
    });
    const player2 = await this.prismaService.user.findUnique({
      where: { id: this.players[1].id },
    });
    const totalPoints = this.players[0].score + this.players[1].score;
    const player1Score = this.players[0].score / totalPoints;
    const player2Score = this.players[1].score / totalPoints;
    const player1Expected = 1 / (1 + Math.pow(10, (player2.elo - player1.elo) / 400));
    const player2Expected = 1 / (1 + Math.pow(10, (player1.elo - player2.elo) / 400));
    const player1NewElo = player1.elo + kFactor * (player1Score - player1Expected);
    const player2NewElo = player2.elo + kFactor * (player2Score - player2Expected);
    await this.prismaService.user.update({
      where: { id: this.players[0].id },
      data: { elo: player1NewElo },
    });
    await this.prismaService.user.update({
      where: { id: this.players[1].id },
      data: { elo: player2NewElo },
    });
  }
}
