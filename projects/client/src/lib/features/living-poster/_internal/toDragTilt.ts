type Point = { clientX: number; clientY: number };

type ToDragTiltParams = {
  start: Point;
  current: Point;
  rect: Pick<DOMRect, 'width' | 'height'>;
};

const FULL_TILT_RATIO = 0.5;

const clamp = (value: number) => Math.min(1, Math.max(-1, value));

export function toDragTilt({ start, current, rect }: ToDragTiltParams) {
  if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };

  return {
    x: clamp(
      (current.clientX - start.clientX) / (rect.width * FULL_TILT_RATIO),
    ),
    y: clamp(
      (current.clientY - start.clientY) / (rect.height * FULL_TILT_RATIO),
    ),
  };
}
