import { World } from './src/World.js';
import { render } from './src/render.js';
import { createPeople } from './src/setup.js';
import { loadPersonImages, loadItemImages } from './src/assets.js';
import { trackMouse } from './src/input.js';
import { THEMES } from './src/data/themes.js';

const NOTICE_GAP_X = 70; // 알아차림: 좌우 테두리 사이 거리
const NOTICE_DY = 40;    // 알아차림: 중심 높이 차

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const [personImages, itemImages] = await Promise.all([
  loadPersonImages(THEMES),
  loadItemImages(THEMES),
]);
const people = createPeople(canvas.width, canvas.height, personImages);
const world = new World(canvas.width, canvas.height, people, NOTICE_GAP_X, NOTICE_DY);
const mouse = trackMouse(canvas);

function loop() {
  const hovered = mouse.inside ? world.personAt(mouse.x, mouse.y) : null;
  world.step(hovered);
  render(ctx, world, personImages, itemImages, hovered);
  requestAnimationFrame(loop);
}
loop();