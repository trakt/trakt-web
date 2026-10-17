import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { toDateFnsLocale } from '$lib/utils/formatting/date/toDateFnsLocale.ts';
import { format } from 'date-fns/format';

export function toHumanDayOfWeek(
  date: Date,
  localeKey: AvailableLocale,
): string {
  const locale = toDateFnsLocale(localeKey);

  return format(date, 'ccc', {
    locale,
  });
}
