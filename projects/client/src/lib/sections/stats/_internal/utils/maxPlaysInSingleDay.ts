import { getDayKey } from '$lib/utils/date/getDayKey.ts';

export function maxPlaysInSingleDay(dates: ReadonlyArray<Date>): number {
  if (dates.length === 0) return 0;

  const counts = dates.reduce((acc, d) => {
    const key = getDayKey(d);
    acc.set(key, (acc.get(key) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());

  return Math.max(...counts.values());
}
