import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { toDateFnsLocale } from '$lib/utils/formatting/date/toDateFnsLocale.ts';
import { format } from 'date-fns/format';

type CalendarDayParts = {
  dayOfMonth: string;
  weekday: string;
  weekdayLong: string;
  monthLong: string;
  year: string;
};

export function toCalendarDayParts(
  date: Date,
  localeKey: AvailableLocale,
): CalendarDayParts {
  const locale = toDateFnsLocale(localeKey);

  return {
    dayOfMonth: format(date, 'd', { locale }),
    weekday: format(date, 'EEE', { locale }),
    weekdayLong: format(date, 'EEEE', { locale }),
    monthLong: format(date, 'LLLL', { locale }),
    year: format(date, 'yyyy', { locale }),
  };
}
