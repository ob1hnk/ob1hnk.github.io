import { overlaps, separate, clampToBounds, containsPoint } from './logic/collision.js';
import { move, startApproach, startTrade } from './logic/movement.js';
import { trade } from './logic/trade.js';
import { logTrade } from './debug.js';

const SOLVER_ITERATIONS = 3; // 겹침 해소 반복 횟수

function pairKey([a, b]) {
  return `${a.id}-${b.id}`;
}

function isBusy(p) {
  return p.state === 'approach' || p.state === 'trade' || p.state === 'leave';
}

export class World {
  constructor(width, height, people, noticeGapX, noticeDy) {
    this.width = width;
    this.height = height;
    this.people = people;
    this.noticeGapX = noticeGapX; // 알아차림: 좌우 테두리 사이 거리
    this.noticeDy = noticeDy;     // 알아차림: 중심 높이 차
    this.noticed = [];            // 이번 틱에 서로 알아차릴 수 있는 쌍
    this.tick = 0;                // 경과 틱 수 (애니메이션용)
  }

  step(hovered = null) {
    this.tick++;
    for (const p of this.people) {
        if (p !== hovered) move(p, this.width, this.height);
    }

    // 1. 새로 알아차린 쌍은 서로를 향해 걷기 시작
    const prevKeys = new Set(this.noticed.map(pairKey));
    this.noticed = this.findPairs().filter(([a, b]) => this.canNotice(a, b));

    for (const [a, b] of this.noticed) {
      if (prevKeys.has(pairKey([a, b]))) continue; // 이미 알아차린 쌍
      if (isBusy(a) || isBusy(b)) continue;        // 다가가는 중이거나 떠나는 중
      startApproach(a, b);
      startApproach(b, a);
    }

    // 2. 다가가다 닿은 쌍은 교환 후 서로 멀어짐
    for (const a of this.people) {
      if (a.state !== 'approach') continue;
      const b = a.partner;
      if (a.id > b.id) continue; // 쌍마다 한 번만 처리
      if (overlaps(a, b)) {
        const [ia, ib] = trade(a, b);
        logTrade(a, b, ia, ib);
        startTrade(a, b);
        startTrade(b, a);
      }
    }

    // 3. 겹침 해소 + 화면 밖으로 밀려난 사람 되돌리기
    for (let k = 0; k < SOLVER_ITERATIONS; k++) {
      for (const [a, b] of this.findPairs()) separate(a, b);
      for (const p of this.people) clampToBounds(p, this.width, this.height);
    }
  }

  // 높이가 비슷하고 좌우로 가까우면 서로 알아차림
  canNotice(a, b) {
    const gapX = Math.abs(a.x - b.x) - (a.width + b.width) / 2;
    return gapX < this.noticeGapX && Math.abs(a.y - b.y) < this.noticeDy;
  }

  findPairs() {
    const pairs = [];
    for (let i = 0; i < this.people.length; i++) {
      for (let j = i + 1; j < this.people.length; j++) {
        pairs.push([this.people[i], this.people[j]]);
      }
    }
    return pairs;
  }

    // (x, y)에 있는 사람, 없으면 null
  personAt(x, y) {
    return this.people.find(p => containsPoint(p, x, y)) ?? null;
  }
}