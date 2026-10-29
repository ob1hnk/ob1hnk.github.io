export function logTrade(a, b, ia, ib) {
  const names = p => p.items.map(item => item.name).join(', ');
  console.log(
    `P${a.id} ${ia.name} ↔ ${ib.name} P${b.id} | ` +
    `P${a.id}: [${names(a)}]  P${b.id}: [${names(b)}]`
  );
}