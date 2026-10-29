const SPEED = 2;                       // 틱당 이동 거리(px)
const WALK_MIN = 60, WALK_MAX = 100;   // 한 번에 걷는 거리(px)
const IDLE_MIN = 30, IDLE_MAX = 90;    // 대기 시간(틱), 60틱 ≈ 1초
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

export function startIdle(person) {
  person.state = 'idle';
  person.target = null;
  person.idleRemaining = randomRange(IDLE_MIN, IDLE_MAX);
}

export function startApproach(person, target) {
  person.state = 'approach';
  person.target = target;
}

function steerToward(person, target) {
  const dx = target.x - person.x;
  const dy = target.y - person.y;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return;
  person.vx = (dx / dist) * SPEED;
  person.vy = (dy / dist) * SPEED;
}

export function startLeave(person, from) {
  const away = Math.atan2(person.y - from.y, person.x - from.x);
  const angle = away + (Math.random() - 0.5) * Math.PI;
  person.vx = Math.cos(angle) * SPEED;
  person.vy = Math.sin(angle) * SPEED;
  person.state = 'leave';
  person.target = null;
  person.walkRemaining = LEAVE_DISTANCE;
}


export function move(person, width, height) {
  if (person.state === 'idle') {
    person.idleRemaining -= 1;
    if (person.idleRemaining <= 0) startWalk(person);
    return;
  }

  if (person.state === 'approach') steerToward(person, person.target);

  person.x += person.vx;
  person.y += person.vy;
  if (person.x < 0 || person.x > width) person.vx *= -1;
  if (person.y < 0 || person.y > height) person.vy *= -1;
  person.x = Math.min(Math.max(person.x, 0), width);
  person.y = Math.min(Math.max(person.y, 0), height);

    if (person.state === 'walk' || person.state === 'leave') {
    person.walkRemaining -= SPEED;
    if (person.walkRemaining <= 0) startIdle(person);
  }
}