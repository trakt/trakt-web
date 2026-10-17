import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { toDateFnsLocale } from '$lib/utils/formatting/date/toDateFnsLocale.ts';
import { isSameWeek } from 'date-fns/isSameWeek';

type IsMaxWeekParams = {
  date: Date;
  maxDate?: Date;
  locale: AvailableLocale;
};

export function isMaxWeek({ date, maxDate, locale }: IsMaxWeekParams) {
  if (!maxDate) return false;

  return isSameWeek(date, maxDate, {
    locale: toDateFnsLocale(locale),
  });
}
