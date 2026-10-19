import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { addDays } from 'date-fns/addDays';
import { DAYS_IN_WEEK } from '$lib/utils/constants.ts';

export function toPlaceholderWeek(date: Date, locale: AvailableLocale) {
  const start = getStartOfWeek(date, locale);

  return Array.from({ length: DAYS_IN_WEEK }, (_, index) => ({
    date: addDays(start, index),
    items: [] as never[],
  }));
}
