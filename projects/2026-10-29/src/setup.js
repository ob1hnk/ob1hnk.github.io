import { THEMES } from './data/themes.js';
import { Item } from './models/Item.js';
import { Person } from './models/Person.js';

export function createPeople(width, height) {
  let nextItemId = 0;
  return THEMES.map((theme, i) => {
    const items = theme.items.map(name => new Item(nextItemId++, name, theme.type));
    const x = Math.random() * width;
    const y = Math.random() * height;
    return new Person(i, x, y, theme.color, items);
  });
}