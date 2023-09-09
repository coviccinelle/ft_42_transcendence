function paddle(
  ctx: CanvasRenderingContext2D | null,
  x: number,
  y: number,
  paddleWidth: number,
  paddleHeight: number,
) {
  if (ctx != null) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
  }
}

export default paddle;
