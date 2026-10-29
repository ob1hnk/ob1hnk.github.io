function randomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

// 각자 랜덤으로 하나씩 골라 교환함
export function trade(a, b) {
  const i = randomIndex(a.items);
  const j = randomIndex(b.items);
  const ia = a.items[i];
  const ib = b.items[j];
  a.items[i] = ib;
  b.items[j] = ia;
  return [ia, ib];
}