const MIN_DRAG_TILT = 0.1;

export function hasDragged(tilt: { x: number; y: number }) {
  return Math.hypot(tilt.x, tilt.y) >= MIN_DRAG_TILT;
}
