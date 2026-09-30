import { getStartOfDay } from '$lib/utils/date/getStartOfDay.ts';
import type { TodayRange } from '../models/TodayRange.ts';
import { getDayRange } from './getDayRange.ts';
import { toPreviousDayRanges } from './toPreviousDayRanges.ts';
import { WEEK_DAY_KEY } from './toTodayDays.ts';

type ToCountRangesParams = {
  dayKey: string | Nil;
  now: Date;
};

export function toCountRanges(
  { dayKey, now }: ToCountRangesParams,
): ReadonlyArray<TodayRange> {
  if (dayKey !== WEEK_DAY_KEY) return [getDayRange({ dayKey, now })];

  return [
    { start: getStartOfDay(now), end: now, isRolling: false },
    ...toPreviousDayRanges(now),
  ];
}
