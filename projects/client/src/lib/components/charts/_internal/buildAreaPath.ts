import { area, curveMonotoneX } from 'd3';

type Point = { x: number; y: number };

type BuildAreaPathProps = {
  points: ReadonlyArray<Point>;
  /** Plot-space y of the area's flat base (usually the x-axis). */
  baseline: number;
};

/**
 * SVG path `d` for a filled area between `baseline` and a smooth line through
 * `points`. Shares the monotone curve with {@link buildLinePath} so a line and
 * its area fill trace the same crest.
 */
export function buildAreaPath(
  { points, baseline }: BuildAreaPathProps,
): string {
  const generator = area<Point>()
    .x((point) => point.x)
    .y0(baseline)
    .y1((point) => point.y)
    .curve(curveMonotoneX);

  return generator([...points]) ?? '';
}
