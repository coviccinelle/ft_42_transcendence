function ball(
  ctx: CanvasRenderingContext2D | null,
  x: number,
  y: number,
  ballWidth: number,
) {
  if (ctx != null) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.rect(x, y, ballWidth, ballWidth);
    ctx.fill();
  }
}

export default ball;
