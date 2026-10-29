import { move, startApproach, startLeave } from './logic/movement.js';
import { trade } from './logic/trade.js';
import { logTrade } from './debug.js';

function pairKey([a, b]) {
  return `${a.id}-${b.id}`;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function isBusy(p) {
  return p.state === 'approach' || p.state === 'leave';
}

export class World {
  constructor(width, height, people, bodyRadius, noticeRadius) {
    this.width = width;
    this.height = height;
    this.people = people;
    this.bodyRadius = bodyRadius;
    this.noticeRadius = noticeRadius;
    this.noticed = [];
  }

    step() {
    for (const p of this.people) move(p, this.width, this.height);

    // 1. 새로 알아차린 쌍은 서로를 향해 걷기 시작
    const prevKeys = new Set(this.noticed.map(pairKey));
    this.noticed = this.findPairs(this.noticeRadius);

    for (const [a, b] of this.noticed) {
      if (prevKeys.has(pairKey([a, b]))) continue;             // 이미 알아차린 쌍
      if (isBusy(a) || isBusy(b)) continue;                    // 다가가는 중이거나 떠나는 중
      startApproach(a, b);
      startApproach(b, a);
    }

    // 2. 다가가다 닿은 쌍은 교환
    for (const a of this.people) {
      if (a.state !== 'approach') continue;
      const b = a.target;
      if (a.id > b.id) continue; // 쌍마다 한 번만 처리
      if (distance(a, b) < this.bodyRadius * 2) {
        const [ia, ib] = trade(a, b);
        logTrade(a, b, ia, ib);
        startLeave(a, b);
        startLeave(b, a);
      }
    }
  }

  findPairs(radius) {
    const pairs = [];
    for (let i = 0; i < this.people.length; i++) {
      for (let j = i + 1; j < this.people.length; j++) {
        const a = this.people[i];
        const b = this.people[j];
        if (distance(a, b) < radius) pairs.push([a, b]);
      }
    }
    return pairs;
  }
}