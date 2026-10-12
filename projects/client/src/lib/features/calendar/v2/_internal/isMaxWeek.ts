import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { LOCALE_MAP } from '$lib/utils/formatting/date/LOCALE_MAP.ts';
import { isSameWeek } from 'date-fns/isSameWeek';

type IsMaxWeekParams = {
  date: Date;
  maxDate?: Date;
  locale: AvailableLocale;
};

export function isMaxWeek({ date, maxDate, locale }: IsMaxWeekParams) {
  if (!maxDate) return false;

  return isSameWeek(date, maxDate, {
    locale: LOCALE_MAP[locale] ?? LOCALE_MAP['en'],
  });
}
