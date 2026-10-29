export function render(ctx, world) {
  ctx.clearRect(0, 0, world.width, world.height);

  for (const p of world.people) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, world.bodyRadius, 0, 2 * Math.PI);
    ctx.fillStyle = p.color;
    ctx.fill();
    if (p.state === 'approach') {
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#000';
      ctx.stroke();
    }
  }
}