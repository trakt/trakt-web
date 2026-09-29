import { addDays } from 'date-fns/addDays';
import { weekStart } from './weekStart.ts';

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
  const start = weekStart(year, weekly.indexOf(plays));

  return { start, end: addDays(start, 6), plays };
}
