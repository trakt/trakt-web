type Point = {
  x: number;
  y: number;
};

type Box = Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>;

type ToTiltParams = {
  point: Point;
  box: Box;
  max: Point;
};

export function toTilt({ point, box, max }: ToTiltParams): Point {
  const x = (point.x - box.left) / box.width - 0.5;
  const y = (point.y - box.top) / box.height - 0.5;

  return { x: x * 2 * max.x, y: -y * 2 * max.y };
}
