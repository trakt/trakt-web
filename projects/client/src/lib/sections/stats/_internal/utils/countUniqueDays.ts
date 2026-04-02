import { getDayKey } from '$lib/utils/date/getDayKey.ts';

export function countUniqueDays(dates: ReadonlyArray<Date>): number {
  return new Set(dates.map(getDayKey)).size;
}
