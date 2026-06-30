import { curveMonotoneX, line } from 'd3';

type Point = { x: number; y: number };

/**
 * SVG path `d` for a smooth (monotone) line through `points`. d3 is used purely
 * for the path math; rendering stays in Svelte. Monotone curvature avoids the
 * overshoot a plain cubic adds between points.
 */
export function buildLinePath(points: ReadonlyArray<Point>): string {
  const generator = line<Point>()
    .x((point) => point.x)
    .y((point) => point.y)
    .curve(curveMonotoneX);

  return generator([...points]) ?? '';
}
