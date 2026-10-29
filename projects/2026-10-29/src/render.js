const FRAME_TICKS = 10; // 몇 틱마다 그림을 바꿀지
const PHASE_STEP = 7;   // 사람마다 박자를 어긋나게 하는 틱 수

const ICON_SIZE = 32;   // 아이템 아이콘 한 변(px)
const ICON_GAP = 4;     // 아이콘 사이 간격(px)
const ICON_MARGIN = 6;  // 몸과 아이콘 줄 사이 간격(px)

function pickFrame(person, tick, set) {
  const left = person.vx < 0;
  const idleImg = left ? set.leftIdle : set.rightIdle;
  if (person.state === 'idle') return idleImg;
  const walkImg = left ? set.leftWalk : set.rightWalk;
  const t = tick + person.id * PHASE_STEP;
  return Math.floor(t / FRAME_TICKS) % 2 === 0 ? walkImg : idleImg;
}

// 머리 위에 아이콘을 가로로 나열. 위가 모자라면 발 아래, 좌우는 캔버스 안으로
function drawItems(ctx, world, person, itemImages) {
  const n = person.items.length;
  const rowW = n * ICON_SIZE + (n - 1) * ICON_GAP;

  let x = person.x - rowW / 2;
  x = Math.min(Math.max(x, 0), world.width - rowW);

  let y = person.y - person.height / 2 - ICON_MARGIN - ICON_SIZE;
  if (y < 0) y = person.y + person.height / 2 + ICON_MARGIN;

  for (let i = 0; i < n; i++) {
    const img = itemImages[person.items[i].name];
    ctx.drawImage(img, x + i * (ICON_SIZE + ICON_GAP), y, ICON_SIZE, ICON_SIZE);
  }
}


export function render(ctx, world, personImages, itemImages, hovered) {
  ctx.clearRect(0, 0, world.width, world.height);

  for (const p of world.people) {
    const set = personImages[p.theme];
    const img = pickFrame(p, world.tick, set);
    const scale = p.width / set.rightIdle.width;
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, p.x - w / 2, p.y - h / 2, w, h);
  }
  if (hovered) drawItems(ctx, world, hovered, itemImages);
}

