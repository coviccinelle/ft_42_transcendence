import { useEffect, useRef, useState } from "react"
import "../styles/game.css"
import paddle, { PADDLE_HEIGHT, PADDLE_WIDTH } from "./Paddle";

interface Size {
  width: number;
  height: number;
}

export const GameZone = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [windowSize, setWindowSize] = useState<Size>({
    width: window.innerWidth - 200,
    height: window.innerHeight - 200
  });
  const middleY = windowSize.height / 2 - PADDLE_HEIGHT / 2;

  function updateGameSize() {
    if (canvasRef.current)
    {
      const ctx = canvasRef.current.getContext("2d");
      setWindowSize({
        width: window.innerWidth - 200,
        height: window.innerHeight - 200,
      });
      paddle(ctx, 10, middleY);
      paddle(ctx, windowSize.width - PADDLE_WIDTH - 10, middleY);
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx)
      {
        window.addEventListener('resize', updateGameSize);
        paddle(ctx, 10, middleY);
        paddle(ctx, windowSize.width - PADDLE_WIDTH - 10, middleY);
      }
    }
    return (() => {
      window.removeEventListener('resize', updateGameSize);
    });
  }, []);

  return (
    <>
      <canvas id="gamezone" ref={canvasRef}
        width={windowSize.width} height={windowSize.height}
      />
    </>
  )
}
