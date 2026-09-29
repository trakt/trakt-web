import type { TodayRange } from '../models/TodayRange.ts';

type ActivityWindow =
  | { startDate: Date; endDate: Date }
  | { startDate?: never; endDate?: never };

export function toActivityWindow(
  { start, end, isRolling }: TodayRange,
): ActivityWindow {
  if (isRolling) return {};

  return { startDate: start, endDate: end };
}
