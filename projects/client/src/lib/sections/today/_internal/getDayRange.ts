import { getEndOfDay } from '$lib/utils/date/getEndOfDay.ts';
import { getStartOfDay } from '$lib/utils/date/getStartOfDay.ts';
import { subtractDays } from '$lib/utils/date/subtractDays.ts';
import type { TodayRange } from '../models/TodayRange.ts';
import { getTodayWindow } from './getTodayWindow.ts';
import { toTodayDays } from './toTodayDays.ts';

const WEEK_LENGTH = 7;

type GetDayRangeParams = {
  dayKey: string | Nil;
  now: Date;
};

export function getDayRange({ dayKey, now }: GetDayRangeParams): TodayRange {
  const day = toTodayDays(now).find((candidate) => candidate.key === dayKey);

  if (!day || day.isToday) return getTodayWindow(now);

  if (day.kind === 'week') {
    return {
      start: getStartOfDay(subtractDays(now, WEEK_LENGTH - 1)),
      end: now,
      isRolling: false,
    };
  }

  return {
    start: getStartOfDay(day.date),
    end: getEndOfDay(day.date),
    isRolling: false,
  };
}
