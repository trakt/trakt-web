import { radarPoint } from './radarPoint.ts';

export function radarPolygon(radii: ReadonlyArray<number>): string {
  return radii
    .map((radius, index) => {
      const { x, y } = radarPoint({ radius, index, count: radii.length });
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}
