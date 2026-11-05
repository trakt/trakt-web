import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { addDays } from 'date-fns/addDays';

const SUNDAY = new Date(2026, 0, 4);
const DAYS_IN_WEEK = 7;

type LocaleWeekday = {
  value: number;
  date: Date;
};

export function toLocaleWeekdays(
  days: ReadonlyArray<number>,
  locale: AvailableLocale,
): LocaleWeekday[] {
  const firstDay = getStartOfWeek(SUNDAY, locale).getDay();

  return days.map((_, index) => {
    const day = (firstDay + index) % DAYS_IN_WEEK;
    return { value: days.at(day) ?? 0, date: addDays(SUNDAY, day) };
  });
}
