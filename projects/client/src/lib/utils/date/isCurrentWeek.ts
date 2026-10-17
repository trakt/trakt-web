import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { toDateFnsLocale } from '$lib/utils/formatting/date/toDateFnsLocale.ts';
import { isSameWeek } from 'date-fns/isSameWeek';

export function isCurrentWeek(date: Date, localeKey: AvailableLocale) {
  const locale = toDateFnsLocale(localeKey);

  const today = new Date();

  return isSameWeek(date, today, {
    locale,
  });
}
