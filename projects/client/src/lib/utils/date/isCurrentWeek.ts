import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { LOCALE_MAP } from '$lib/utils/formatting/date/LOCALE_MAP.ts';
import { isSameWeek } from 'date-fns/isSameWeek';

export function isCurrentWeek(date: Date, localeKey: AvailableLocale) {
  const locale = LOCALE_MAP[localeKey] ?? LOCALE_MAP['en'];

  const today = new Date();

  return isSameWeek(date, today, {
    locale,
  });
}
