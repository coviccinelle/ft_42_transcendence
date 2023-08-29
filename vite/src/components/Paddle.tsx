export const PADDLE_HEIGHT = 60;
export const PADDLE_WIDTH = 10;


function paddle(ctx: (CanvasRenderingContext2D | null), x: number, y: number) {
  if (ctx != null)
  {
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
  }
}

export default paddle;
