import type { AwardTimelineYear } from './models/AwardTimeline.ts';

export function toNearestAwardYear(
  years: ReadonlyArray<AwardTimelineYear>,
  x: number,
): AwardTimelineYear | undefined {
  return years.reduce<AwardTimelineYear | undefined>(
    (nearest, year) =>
      nearest == null || Math.abs(year.x - x) < Math.abs(nearest.x - x)
        ? year
        : nearest,
    undefined,
  );
}
