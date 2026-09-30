import { getEndOfDay } from '$lib/utils/date/getEndOfDay.ts';
import { getStartOfDay } from '$lib/utils/date/getStartOfDay.ts';
import { subtractDays } from '$lib/utils/date/subtractDays.ts';
import type { TodayRange } from '../models/TodayRange.ts';
import { TODAY_WEEK_LENGTH } from './TODAY_WEEK_LENGTH.ts';

export function toPreviousDayRanges(now: Date): ReadonlyArray<TodayRange> {
  return Array.from({ length: TODAY_WEEK_LENGTH - 1 }, (_, index) => {
    const date = subtractDays(now, index + 1);
    return {
      start: getStartOfDay(date),
      end: getEndOfDay(date),
      isRolling: false,
    };
  });
}
