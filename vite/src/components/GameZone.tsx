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
  const [rightPaddlePos, setRightPaddlePos] = useState<number>(windowSize.width - PADDLE_WIDTH - 10);
    const middleY = windowSize.height / 2 - PADDLE_HEIGHT / 2;

  // TODO 1: les paddle disparaissent quand resize
  // * utiliser scale ? https://stackoverflow.com/questions/74345446/html-canvas-resize / https://stackoverflow.com/questions/53549401/scale-html-canvas-html-reactjs?rq=3
  // TODO 2: paddle movement

  // TODO 3: connection a un autre joueur (back)
  // TODO 4: paddle adverse recup info

  function updateGameSize() {
    setWindowSize({
      width: window.innerWidth - 200,
      height: window.innerHeight - 200,
    });
    setRightPaddlePos(windowSize.width - PADDLE_WIDTH - 10);
    requestAnimationFrame(render);
  }

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx)
      {
        window.addEventListener('resize', updateGameSize);
        requestAnimationFrame(render);
      }
    }
    return (() => {
      window.removeEventListener('resize', updateGameSize);
    });
  }, []);


  function render() {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, windowSize.width, windowSize.height);

        paddle(ctx, 10, middleY);
        paddle(ctx, rightPaddlePos, middleY);

        // paddle(ctx, 10, middleY);
        // paddle(ctx, windowSize.width - PADDLE_WIDTH - 10, middleY);

        requestAnimationFrame(render);
      }
    }
  }

  return (
    <>
      <canvas id="gamezone" ref={canvasRef}
        width={windowSize.width} height={windowSize.height}
      />
    </>
  )
}
