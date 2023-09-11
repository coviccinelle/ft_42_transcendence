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

export type WsException = {
  status: string;
  message: string;
}
