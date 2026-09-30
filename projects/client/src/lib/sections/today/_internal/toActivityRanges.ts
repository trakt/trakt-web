import type { TodayRange } from '../models/TodayRange.ts';
import { getDayRange } from './getDayRange.ts';
import { getTodayWindow } from './getTodayWindow.ts';
import { toPreviousDayRanges } from './toPreviousDayRanges.ts';
import { WEEK_DAY_KEY } from './toTodayDays.ts';

type ToActivityRangesParams = {
  dayKey: string | Nil;
  now: Date;
};

export function toActivityRanges(
  { dayKey, now }: ToActivityRangesParams,
): ReadonlyArray<TodayRange> {
  if (dayKey !== WEEK_DAY_KEY) return [getDayRange({ dayKey, now })];

  return [getTodayWindow(now), ...toPreviousDayRanges(now)];
}
