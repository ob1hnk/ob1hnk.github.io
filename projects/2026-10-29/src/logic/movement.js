import { clampToBounds } from "./collision.js";

const SPEED = 2;                       // 틱당 이동 거리(px)
const WALK_MIN = 60, WALK_MAX = 100;   // 한 번에 걷는 거리(px)
const IDLE_MIN = 30, IDLE_MAX = 90;    // 대기 시간(틱), 60틱 ≈ 1초
export const TRADE_TICKS = 120;               // 교환 중 멈춤 시간(틱), 120틱 ≈ 2초
const LEAVE_DISTANCE = 250;

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function startWalk(person) {
  const angle = Math.random() * 2 * Math.PI;
  person.vx = Math.cos(angle) * SPEED;
  person.vy = Math.sin(angle) * SPEED;
  person.state = 'walk';
  person.walkRemaining = randomRange(WALK_MIN, WALK_MAX);
}

function startIdle(person) {
  person.state = 'idle';
  person.partner = null;
  person.idleRemaining = randomRange(IDLE_MIN, IDLE_MAX);
}

export function startApproach(person, partner) {
  person.state = 'approach';
  person.partner = partner;
}

function steerToward(person, partner) {
  const dx = partner.x - person.x;
  const dy = partner.y - person.y;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return;
  person.vx = (dx / dist) * SPEED;
  person.vy = (dy / dist) * SPEED;
}

export function startLeave(person, partner) {
  const away = Math.atan2(person.y - partner.y, person.x - partner.x);
  const angle = away + (Math.random() - 0.5) * Math.PI;
  person.vx = Math.cos(angle) * SPEED;
  person.vy = Math.sin(angle) * SPEED;
  person.state = 'leave';
  person.partner = null;
  person.walkRemaining = LEAVE_DISTANCE;
}

// 상대를 바라보며 멈춤. 끝나면 상대 반대쪽으로 떠남
export function startTrade(person, partner, gave, got) {
  steerToward(person, partner); // 이동은 안 하고 바라보는 방향만 정함
  person.state = 'trade';
  person.partner = partner;
  person.tradeGave = gave;
  person.tradeGot = got;
  person.tradeRemaining = TRADE_TICKS;
}


export function move(person, width, height) {
  if (person.state === 'idle') {
    person.idleRemaining -= 1;
    if (person.idleRemaining <= 0) startWalk(person);
    return;
  }
  if (person.state === 'trade') {
    person.tradeRemaining -= 1;
    if (person.tradeRemaining <= 0) startLeave(person, person.partner);
    return;
  }
  if (person.state === 'approach') steerToward(person, person.partner);

  person.x += person.vx;
  person.y += person.vy;
  const halfW = person.width / 2;
  const halfH = person.height / 2;
  if (person.x < halfW || person.x > width - halfW) person.vx *= -1;
  if (person.y < halfH || person.y > height - halfH) person.vy *= -1;
  clampToBounds(person, width, height);

    if (person.state === 'walk' || person.state === 'leave') {
    person.walkRemaining -= SPEED;
    if (person.walkRemaining <= 0) startIdle(person);
  }
}