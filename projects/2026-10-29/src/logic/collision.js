// 두 상자가 겹치는지
export function overlaps(a, b) {
  return Math.abs(a.x - b.x) < (a.width + b.width) / 2 &&
         Math.abs(a.y - b.y) < (a.height + b.height) / 2;
}

// 겹쳐 있으면 덜 겹친 축 방향으로 반씩 밀어냄
export function separate(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const overlapX = (a.width + b.width) / 2 - Math.abs(dx);
  const overlapY = (a.height + b.height) / 2 - Math.abs(dy);
  if (overlapX <= 0 || overlapY <= 0) return;

  if (overlapX < overlapY) {
    const push = (overlapX / 2) * (dx < 0 ? -1 : 1);
    a.x -= push;
    b.x += push;
  } else {
    const push = (overlapY / 2) * (dy < 0 ? -1 : 1);
    a.y -= push;
    b.y += push;
  }
}

// 상자 전체가 캔버스 안에 있도록 중심 위치를 제한
export function clampToBounds(p, width, height) {
  p.x = Math.min(Math.max(p.x, p.width / 2), width - p.width / 2);
  p.y = Math.min(Math.max(p.y, p.height / 2), height - p.height / 2);
}