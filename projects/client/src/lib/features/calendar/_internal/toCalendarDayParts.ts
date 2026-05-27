import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { LOCALE_MAP } from '$lib/utils/formatting/date/LOCALE_MAP.ts';
import { format } from 'date-fns/format';

type CalendarDayParts = {
  dayOfMonth: string;
  month: string;
  weekday: string;
};

export function toCalendarDayParts(
  date: Date,
  localeKey: AvailableLocale = 'en',
): CalendarDayParts {
  const locale = LOCALE_MAP[localeKey] ?? LOCALE_MAP['en'];

  return {
    dayOfMonth: format(date, 'dd', { locale }),
    month: format(date, 'MMM', { locale }),
    weekday: format(date, 'EEE', { locale }),
  };
}
