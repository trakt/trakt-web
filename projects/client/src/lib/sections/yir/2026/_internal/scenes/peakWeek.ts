import { yirWeekRange } from '$lib/sections/yir/_internal/yirWeekRange.ts';

type PeakWeek = {
  start: Date;
  end: Date;
  plays: number;
};

export function peakWeek(
  weekly: ReadonlyArray<number>,
  year: number,
): PeakWeek | null {
  if (weekly.length === 0) return null;

  const plays = Math.max(...weekly);

  return { ...yirWeekRange(year, weekly.indexOf(plays)), plays };
}
