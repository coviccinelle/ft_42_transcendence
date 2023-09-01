import { useEffect, useRef, useState } from 'react';
import paddle from '../../utils/game/paddle';
import ball from '../../utils/game/ball';
import GameFinishedDialog from './GameFinishedDialog';

interface Size {
  width: number;
  height: number;
}

export const GameZone = (props: {
  score: number[];
  setScore: React.Dispatch<React.SetStateAction<number[]>>;
}): JSX.Element => {
  const [windowSize, setWindowSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [paddleSize, setPaddleSize] = useState<Size>({
    width: window.innerWidth / 100,
    height: window.innerHeight / 10,
  });
  const [ballWidth, setBallWidth] = useState<number>(window.innerWidth / 100);
  const [myPaddlePos, setMyPaddlePos] = useState<number[]>([
    10,
    windowSize.height / 2 - paddleSize.height / 2,
  ]);
  const [playerTwoPaddlePos, setPlayerTwoPaddlePos] = useState<number[]>([
    windowSize.width - 10 - paddleSize.width,
    windowSize.height / 2 - paddleSize.height / 2,
  ]);
  const [ballPos, setBallPos] = useState<number[]>([
    windowSize.width / 2,
    windowSize.height / 2,
  ]);
  const [ballSpeedX, setBallSpeedX] = useState<number>(-4);
  const [ballSpeedY, setBallSpeedY] = useState<number>(4);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [game, setGame] = useState<any>(null);

  function updateGameSize() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setPaddleSize({
      width: window.innerWidth / 100,
      height: window.innerHeight / 10,
    });
    setMyPaddlePos([10, windowSize.height / 2 - paddleSize.height / 2]);
    setPlayerTwoPaddlePos([
      windowSize.width - 10 - paddleSize.width,
      windowSize.height / 2 - paddleSize.height / 2,
    ]);
    setBallWidth(window.innerWidth / 100);
    setBallPos([windowSize.width / 2, windowSize.height / 2]);
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

  const [gameFinishedDialog, setGameFinishedDialog] = useState<boolean>(false);

  function stopGame() {
    clearTimeout(game);
    setBallSpeedX(0);
    setBallSpeedY(0);

    setGame(0);
  }

  function gameFinished() {
    if (props.score[0] === 1 || props.score[1] === 1) {
      stopGame();
      setGameFinishedDialog(true);
    }
  }

  useEffect(() => {
    gameFinished();
  }, [props.score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let newMyPaddlePos = [...myPaddlePos];
      if (e.key === 'ArrowUp' && myPaddlePos[1] > 0 + 10) {
        newMyPaddlePos[1] -= 10;
      }
      if (
        e.key === 'ArrowDown' &&
        myPaddlePos[1] < windowSize.height - paddleSize.height - 10
      ) {
        newMyPaddlePos[1] += 10;
      }
      setMyPaddlePos(newMyPaddlePos);
      let newPlayerTwoPaddlePos = [...playerTwoPaddlePos];
      if (e.key === 'w' && playerTwoPaddlePos[1] > 0 + 10) {
        newPlayerTwoPaddlePos[1] -= 10;
      }
      if (
        e.key === 's' &&
        playerTwoPaddlePos[1] < windowSize.height - paddleSize.height - 10
      ) {
        newPlayerTwoPaddlePos[1] += 10;
      }
      setPlayerTwoPaddlePos(newPlayerTwoPaddlePos);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [myPaddlePos, windowSize, playerTwoPaddlePos]);

  useEffect(() => {
    const updateBallPosition = () => {
      const newBallPosX = ballPos[0] + ballSpeedX;
      const newBallPosY = ballPos[1] + ballSpeedY;

      if (newBallPosY <= 0 || newBallPosY >= windowSize.height - ballWidth) {
        setBallSpeedY(ballSpeedY * -1);
      }
      if (
        (newBallPosX <= myPaddlePos[0] + paddleSize.width + 10 &&
          newBallPosY >= myPaddlePos[1] &&
          newBallPosY <= myPaddlePos[1] + paddleSize.height) ||
        (newBallPosX >= playerTwoPaddlePos[0] - paddleSize.width &&
          newBallPosY >= playerTwoPaddlePos[1] &&
          newBallPosY <= playerTwoPaddlePos[1] + paddleSize.height)
      ) {
        setBallSpeedX(ballSpeedX * -1);
      }
      setBallPos([newBallPosX, newBallPosY]);
      if (newBallPosX <= 0) {
        props.setScore([props.score[0], props.score[1] + 1]);
        setBallPos([windowSize.width / 2, windowSize.height / 2]);
        setBallSpeedX(ballSpeedX * -1);
      }
      if (newBallPosX >= windowSize.width - ballWidth) {
        props.setScore([props.score[0] + 1, props.score[1]]);
        setBallPos([windowSize.width / 2, windowSize.height / 2]);
        setBallSpeedX(ballSpeedX * -1);
      }
    };
    setGame(setTimeout(updateBallPosition, 1000 / 120));
    return () => {
      clearTimeout(game);
    };
  }, [ballPos, ballSpeedX, ballSpeedY, windowSize]);

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
    <>
      <div className="flex max-w-[95%] max-h-[75%] justify-center items-center">
        <canvas
          id="gamezone"
          className="flex bg-gray-500 w-full h-full aspect-[16/9]"
          ref={canvas}
          width={windowSize.width}
          height={windowSize.height}
        />
        <GameFinishedDialog
          gameFinishedDialog={gameFinishedDialog}
          setGameFinishedDialog={setGameFinishedDialog}
          score={props.score}
        />
      </div>
    </>
  );
};
