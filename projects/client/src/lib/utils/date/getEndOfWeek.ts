import { toDateFnsLocale } from '$lib/utils/formatting/date/toDateFnsLocale.ts';
import { endOfWeek } from 'date-fns/endOfWeek';
import type { AvailableLocale } from '../../features/i18n/index.ts';

export function getEndOfWeek(date: Date, localeKey: AvailableLocale) {
  const locale = toDateFnsLocale(localeKey);

  return endOfWeek(date, {
    locale,
  });
}
