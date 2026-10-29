const FRAME_TICKS = 10; // 몇 틱마다 그림을 바꿀지
const PHASE_STEP = 7;   // 사람마다 박자를 어긋나게 하는 틱 수

function pickFrame(person, tick, set) {
  const left = person.vx < 0;
  const idleImg = left ? set.leftIdle : set.rightIdle;
  if (person.state === 'idle') return idleImg;
  const walkImg = left ? set.leftWalk : set.rightWalk;
  const t = tick + person.id * PHASE_STEP;
  return Math.floor(t / FRAME_TICKS) % 2 === 0 ? walkImg : idleImg;
}

export function render(ctx, world, sprites) {
  ctx.clearRect(0, 0, world.width, world.height);

  for (const p of world.people) {
    const set = sprites[p.theme];
    const img = pickFrame(p, world.tick, set);
    const scale = p.width / set.rightIdle.width;
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, p.x - w / 2, p.y - h / 2, w, h);
  }
}