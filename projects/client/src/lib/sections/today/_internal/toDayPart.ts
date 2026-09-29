import type { TodayDayPart } from '../models/TodayDayPart.ts';

const MORNING_START = 5;
const AFTERNOON_START = 12;
const EVENING_START = 18;
const NIGHT_START = 23;

export function toDayPart(date: Date): TodayDayPart {
  const hour = date.getHours();

  if (hour >= NIGHT_START || hour < MORNING_START) return 'night';
  if (hour >= EVENING_START) return 'evening';
  if (hour >= AFTERNOON_START) return 'afternoon';
  return 'morning';
}
