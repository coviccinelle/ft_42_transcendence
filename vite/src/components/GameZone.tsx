import { useEffect, useRef, useState } from 'react';
import '../styles/game.css';
import paddle from '../utils/game/paddle';
import ball from '../utils/game/ball';

interface Size {
  width: number;
  height: number;
}

export const GameZone = (props: {
  score: number[];
  setScore: React.Dispatch<React.SetStateAction<number[]>>;
}): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
  const [ballPos, setBallPos] = useState<number[]>([
    windowSize.width / 2,
    windowSize.height / 2,
  ]);
  const [ballSpeedX, setBallSpeedX] = useState<number>(1);
  const [ballSpeedY, setBallSpeedY] = useState<number>(1);
  // TODO 1: les paddle disparaissent quand resize
  // * utiliser scale ? https://stackoverflow.com/questions/74345446/html-canvas-resize / https://stackoverflow.com/questions/53549401/scale-html-canvas-html-reactjs?rq=3
  // TODO 2: paddle movement

  // TODO 3: connection a un autre joueur (back)
  // TODO 4: paddle adverse recup info

  function updateGameSize() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setPaddleSize({
      width: window.innerWidth / 100,
      height: window.innerHeight / 10,
    });
    setBallWidth(window.innerWidth / 100);
    requestAnimationFrame(render);
  }

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        window.addEventListener('resize', updateGameSize);
        requestAnimationFrame(render);
      }
    }
    return () => {
      window.removeEventListener('resize', updateGameSize);
    };
  }, [windowSize, myPaddlePos[1]]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && myPaddlePos[1] > 0 + 5) {
        setMyPaddlePos([myPaddlePos[0], myPaddlePos[1] - 10]);
      } else if (
        e.key === 'ArrowDown' &&
        myPaddlePos[1] < windowSize.height - paddleSize.height - 5
      ) {
        setMyPaddlePos([myPaddlePos[0], myPaddlePos[1] + 10]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [myPaddlePos]);

  function render() {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, windowSize.width, windowSize.height);
        paddle(
          ctx,
          myPaddlePos[0],
          myPaddlePos[1],
          paddleSize.width,
          paddleSize.height,
        );
        ball(ctx, ballPos[0], ballPos[1], ballWidth);
        requestAnimationFrame(render);
      }
    }
  }

  function play() {
    ballPos[0] += ballSpeedX;
    ballPos[1] += ballSpeedY;
    render();
  }

  function reset() {
    setBallPos([windowSize.width / 2, windowSize.height / 2]);
    setBallSpeedX(1);
    setBallSpeedY(1);
    setMyPaddlePos([10, windowSize.height / 2 - paddleSize.height / 2]);
  }

  useEffect(() => {
    if (ballPos[0] > windowSize.width - ballWidth) {
      props.setScore([props.score[0], props.score[1] + 1]);
      reset();
    } else if (ballPos[0] < 0 + ballWidth) {
      props.setScore([props.score[0] + 1, props.score[1]]);
      reset();
    }
    if (ballPos[1] > windowSize.height - ballWidth) {
      setBallSpeedY(-ballSpeedY);
    } else if (ballPos[1] < 0 + ballWidth) {
      setBallSpeedY(-ballSpeedY);
    }
  }, [ballPos]);

  useEffect(() => {
    // draw the ball and paddle on the canvas with interval
    const interval = setInterval(() => {
      render();
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    play();
  }, []);

  return (
    <>
      <div className="w-[75%] h-[85%]">
        <canvas
          id="gamezone"
          className="bg-gray-500"
          ref={canvasRef}
          width={windowSize.width}
          height={windowSize.height}
        />
      </div>
    </>
  );
};
