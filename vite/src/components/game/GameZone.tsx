import { useEffect, useRef, useState } from 'react';
import paddle from '../../utils/game/paddle';
import ball from '../../utils/game/ball';
import { Direction } from '../../utils/game/types';

interface Size {
  width: number;
  height: number;
}

export const GameZone = (props: {
  sendInput: any;
  gameInfos: any;
}): JSX.Element => {
  const [windowSize, setWindowSize] = useState<Size>({
    width: window.innerWidth + (window.innerWidth / 100) * 2,
    height: window.innerHeight,
  });
  const [paddleSize, setPaddleSize] = useState<Size>({
    height:
      (windowSize.height * props.gameInfos.players[0].paddle.size) /
      props.gameInfos.courtSize.y,
    width: window.innerWidth / 100,
  });
  const [windowSizeGame, setWindowSizeGame] = useState<Size>({
    width: windowSize.width - paddleSize.width * 2,
    height: windowSize.height,
  });
  const [ballWidth, setBallWidth] = useState<number>(0);
  const [myPaddlePos, setMyPaddlePos] = useState<number[]>([0, 0]);
  const [playerTwoPaddlePos, setPlayerTwoPaddlePos] = useState<number[]>([
    0, 0,
  ]);
  const [ballPos, setBallPos] = useState<number[]>([
    windowSizeGame.width / 2,
    windowSizeGame.height / 2,
  ]);
  const canvas = useRef<HTMLCanvasElement | null>(null);

  function updateGameSize() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setWindowSizeGame({
      width: windowSize.width - paddleSize.width * 2,
      height: windowSize.height,
    });
    setPaddleSize({
      height:
        (windowSize.height * props.gameInfos.players[0].paddle.size) /
        props.gameInfos.courtSize.y,
      width: window.innerWidth / 100,
    });
    setMyPaddlePos([
      0,
      (props.gameInfos.players[0].paddle.position * windowSize.height) /
        props.gameInfos.courtSize.y -
        paddleSize.height / 2,
    ]);
    setPlayerTwoPaddlePos([
      windowSizeGame.width + paddleSize.width,
      (props.gameInfos.players[1].paddle.position * windowSize.height) /
        props.gameInfos.courtSize.y -
        paddleSize.height / 2,
    ]);
    setBallWidth(
      ((windowSizeGame.width * props.gameInfos.ball.size) /
        props.gameInfos.courtSize.x) *
        2,
    );
    setBallPos([
      (windowSizeGame.width * props.gameInfos.ball.position.x) /
        props.gameInfos.courtSize.x +
        paddleSize.width,
      (windowSizeGame.height * props.gameInfos.ball.position.y) /
        props.gameInfos.courtSize.y,
    ]);
  }

  function draw(ctx?: CanvasRenderingContext2D | null) {
    if (ctx) {
      ctx.clearRect(0, 0, windowSize.width, windowSize.height);
      paddle(
        ctx,
        myPaddlePos[0],
        myPaddlePos[1],
        paddleSize.width,
        paddleSize.height,
      );
      paddle(
        ctx,
        playerTwoPaddlePos[0],
        playerTwoPaddlePos[1],
        paddleSize.width,
        paddleSize.height,
      );
      ball(ctx, ballPos[0], ballPos[1], ballWidth);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        props.sendInput(Direction.DOWN);
      }
      if (e.key === 'ArrowUp') {
        props.sendInput(Direction.UP);
      }
    };
    const handleKeyUp = () => {
      props.sendInput(Direction.NONE);
    };
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [myPaddlePos, windowSize, playerTwoPaddlePos]);

  useEffect(() => {
    if (props.gameInfos) {
      updateGameSize();
    }
  }, [props.gameInfos]);

  useEffect(() => {
    if (canvas.current) {
      const ctx = canvas.current.getContext('2d');
      if (ctx) {
        draw(ctx);
        window.addEventListener('resize', updateGameSize);
      }
    }
    return () => {
      window.removeEventListener('resize', updateGameSize);
    };
  }, [windowSize, myPaddlePos, playerTwoPaddlePos, ballPos]);
  return (
    <div className="flex max-w-[95%] max-h-[75%] justify-center items-center">
      <canvas
        id="gamezone"
        className="flex bg-gray-500 w-full h-full aspect-[16/9] rounded-xl"
        ref={canvas}
        width={windowSize.width}
        height={windowSize.height}
      />
    </div>
  );
};
