// 캔버스 기준 마우스 위치를 계속 갱신하는 객체를 반환
export function trackMouse(canvas) {
  const mouse = { x: 0, y: 0, inside: false };

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.inside = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.inside = false;
  });

  return mouse;
}