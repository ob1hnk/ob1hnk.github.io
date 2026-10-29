import { THEMES } from './data/themes.js';
import { Item } from './models/Item.js';
import { Person } from './models/Person.js';

const SPRITE_SCALE = 0.2; // 원본 이미지 대비 화면 크기 (이미지 받고 조정)

export function createPeople(width, height, sprites) {
  let nextItemId = 0;
  return THEMES.map((def, i) => {
    const items = def.items.map(name => new Item(nextItemId++, name, def.theme));
    const img = sprites[def.theme].rightIdle;
    const w = img.width * SPRITE_SCALE;
    const h = img.height * SPRITE_SCALE;
    const x = Math.random() * width;
    const y = Math.random() * height;
    return new Person(i, x, y, def.theme, w, h, items);
  });
}