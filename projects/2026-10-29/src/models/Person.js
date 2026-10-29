export class Person {
  constructor(id, x, y, theme, items) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.state = 'idle' // 'walk' 또는 'idle'
    this.walkRemaining = 0; // 남은 걸을 거리 (px)
    this.idleRemaining = 0; // 남은 대기 시간 (틱)
    this.target = null;
    this.theme = theme;
    this.items = items;
  }
}