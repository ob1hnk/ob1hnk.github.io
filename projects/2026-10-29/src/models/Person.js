export class Person {
  constructor(id, x, y, theme, width, height, items) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.state = 'idle'; // 'walk', 'idle', 'approach', 'trade', 'leave'
    this.walkRemaining = 0; // 남은 걸을 거리 (px)
    this.idleRemaining = 0; // 남은 대기 시간 (틱)
    this.tradeRemaining = 0;    // 남은 교환 시간 (틱)
    this.partner = null;
    this.theme = theme;
    this.width = width;
    this.height = height;
    this.items = items;
  }
}