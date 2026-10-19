import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { getEndOfWeek } from '$lib/utils/date/getEndOfWeek.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { differenceInDays } from 'date-fns/differenceInDays';
import { endOfMonth } from 'date-fns/endOfMonth';
import { startOfMonth } from 'date-fns/startOfMonth';

export function toMonthGridRange(date: Date, locale: AvailableLocale) {
  const reference = getEndOfWeek(date, locale);
  const start = getStartOfWeek(startOfMonth(reference), locale);
  const end = getEndOfWeek(endOfMonth(reference), locale);

  return {
    reference,
    start,
    days: differenceInDays(end, start) + 1,
  };
}
