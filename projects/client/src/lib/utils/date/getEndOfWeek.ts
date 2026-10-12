import { LOCALE_MAP } from '$lib/utils/formatting/date/LOCALE_MAP.ts';
import { endOfWeek } from 'date-fns/endOfWeek';
import type { AvailableLocale } from '../../features/i18n/index.ts';

export function getEndOfWeek(date: Date, localeKey: AvailableLocale) {
  const locale = LOCALE_MAP[localeKey] ?? LOCALE_MAP['en'];

  return endOfWeek(date, {
    locale,
  });
}
