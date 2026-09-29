type Point = {
  x: number;
  y: number;
};

const CENTER = 50;

export function radarPoint(
  { radius, index, count }: { radius: number; index: number; count: number },
): Point {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;

  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}
