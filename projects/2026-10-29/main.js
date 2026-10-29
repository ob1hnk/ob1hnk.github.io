import { World } from './src/World.js';
import { render } from './src/render.js';
import { createPeople } from './src/setup.js';

const BODY_RADIUS = 70;
const NOTICE_RADIUS = 250;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const people = createPeople(canvas.width, canvas.height);
const world = new World(canvas.width, canvas.height, people, BODY_RADIUS, NOTICE_RADIUS);

function loop() {
  world.step();
  render(ctx, world);
  requestAnimationFrame(loop);
}
loop();