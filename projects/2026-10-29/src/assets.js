function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`이미지 로드 실패: ${src}`));
    img.src = src;
  });
}

// 반환: { A: { leftIdle, rightIdle, leftWalk, rightWalk }, B: {...}, ... }
export async function loadPersonImages(themes) {
  const personImages = {};
  for (const { theme } of themes) {
    const dir = `assets/people/${theme}`;
    const [leftIdle, rightIdle, leftWalk, rightWalk] = await Promise.all([
      loadImage(`${dir}/left-idle.png`),
      loadImage(`${dir}/right-idle.png`),
      loadImage(`${dir}/left-walk.png`),
      loadImage(`${dir}/right-walk.png`),
    ]);
    personImages[theme] = { leftIdle, rightIdle, leftWalk, rightWalk };
  }
  return personImages;
}

// 반환: { A1: img, A2: img, ... }
export async function loadItemImages(themes) {
  const names = themes.flatMap(def => def.items);
  const images = await Promise.all(
    names.map(name => loadImage(`assets/items/${name}.png`))
  );
  const result = {};
  names.forEach((name, i) => { result[name] = images[i]; });
  return result;
}