import { toDateFnsLocale } from '$lib/utils/formatting/date/toDateFnsLocale.ts';
import { startOfWeek } from 'date-fns/startOfWeek';
import type { AvailableLocale } from '../../features/i18n/index.ts';

export function getStartOfWeek(date: Date, localeKey: AvailableLocale) {
  const locale = toDateFnsLocale(localeKey);

  return startOfWeek(date, {
    locale,
  });
}
