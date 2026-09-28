import { formatLocalDate } from '$lib/utils/date/formatLocalDate.ts';
import { subtractDays } from '$lib/utils/date/subtractDays.ts';

const TODAY_DAY_COUNT = 7;

export function toTodayDays(now: Date) {
  return Array.from({ length: TODAY_DAY_COUNT }, (_, daysAgo) => {
    const date = subtractDays(now, daysAgo);
    return { key: formatLocalDate(date), date, isToday: daysAgo === 0 };
  });
}
