import { time } from '$lib/utils/timing/time.ts';
import type { TodayRange } from '../models/TodayRange.ts';

const TODAY_WINDOW = time.hours(24);

export function getTodayWindow(now: Date): TodayRange {
  return {
    start: new Date(now.getTime() - TODAY_WINDOW),
    end: now,
    isRolling: true,
  };
}
