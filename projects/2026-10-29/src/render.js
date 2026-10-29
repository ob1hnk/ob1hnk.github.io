import { TRADE_TICKS } from "./logic/movement.js";

const FRAME_TICKS = 10; // 몇 틱마다 그림을 바꿀지
const PHASE_STEP = 7;   // 사람마다 박자를 어긋나게 하는 틱 수

const ICON_SIZE = 60;   // 아이템 아이콘 한 변(px)
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

// 가로 rowW짜리 아이콘 줄을 놓을 왼쪽 위 좌표
function iconRowPosition(world, person, rowW) {
  let x = person.x - rowW / 2;
  x = Math.min(Math.max(x, 0), world.width - rowW);

  let y = person.y - person.height / 2 - ICON_MARGIN - ICON_SIZE;
  if (y < 0) y = person.y + person.height / 2 + ICON_MARGIN;

  return { x, y };
}

function drawItems(ctx, world, person, itemImages) {
  const n = person.items.length;
  const rowW = n * ICON_SIZE + (n - 1) * ICON_GAP;
  const { x, y } = iconRowPosition(world, person, rowW);

  for (let i = 0; i < n; i++) {
    const img = itemImages[person.items[i].name];
    ctx.drawImage(img, x + i * (ICON_SIZE + ICON_GAP), y, ICON_SIZE, ICON_SIZE);
  }
}

// 앞 절반: 내준 아이템, 뒤 절반: 받은 아이템. 각각 페이드 인 → 아웃
function drawTradeIcon(ctx, world, person, itemImages) {
  const t = 1 - person.tradeRemaining / TRADE_TICKS; // 교환 진행도 0 → 1
  const first = t < 0.5;
  const item = first ? person.tradeGave : person.tradeGot;
  const local = (first ? t : t - 0.5) * 2;           // 각 절반 안에서 0 → 1
  const { x, y } = iconRowPosition(world, person, ICON_SIZE);

  ctx.save();
  ctx.globalAlpha = Math.sin(Math.PI * local);
  ctx.drawImage(itemImages[item.name], x, y, ICON_SIZE, ICON_SIZE);
  ctx.restore();
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
    if (p.state === 'trade' && p !== hovered) drawTradeIcon(ctx, world, p, itemImages);
  }
  if (hovered) drawItems(ctx, world, hovered, itemImages);
}

