function ball(
  ctx: CanvasRenderingContext2D | null,
  x: number,
  y: number,
  ballWidth: number,
) {
  if (ctx != null) {
    ctx.fillStyle = 'white';
    // fill for ball so round not rect
    ctx.beginPath();
    ctx.arc(x, y, ballWidth, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default ball;
