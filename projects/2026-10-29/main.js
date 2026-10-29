import { World } from './src/World.js';
import { render } from './src/render.js';
import { createPeople } from './src/setup.js';
import { loadSprites } from './src/sprites.js';
import { THEMES } from './src/data/themes.js';

const NOTICE_GAP_X = 70; // 알아차림: 좌우 테두리 사이 거리
const NOTICE_DY = 40;    // 알아차림: 중심 높이 차

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const sprites = await loadSprites(THEMES);
const people = createPeople(canvas.width, canvas.height, sprites);
const world = new World(canvas.width, canvas.height, people, NOTICE_GAP_X, NOTICE_DY);

function loop() {
  world.step();
  render(ctx, world, sprites);
  requestAnimationFrame(loop);
}
loop();