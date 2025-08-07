import { LOCALE_MAP } from '$lib/utils/formatting/date/LOCALE_MAP.ts';
import { startOfWeek } from 'date-fns/startOfWeek';
import type { AvailableLocale } from '../../features/i18n/index.ts';

export function getStartOfWeek(date: Date, localeKey: AvailableLocale) {
  const locale = LOCALE_MAP[localeKey] ?? LOCALE_MAP['en'];

  return startOfWeek(date, {
    locale,
  });
}
