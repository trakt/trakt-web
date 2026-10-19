import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { isCurrentWeek } from '$lib/utils/date/isCurrentWeek.ts';
import { formatLocalDate } from '$lib/utils/date/formatLocalDate.ts';

export function toCalendarDateValue(date: Date, locale: AvailableLocale) {
  if (isCurrentWeek(date, locale)) return null;

  return formatLocalDate(date);
}
