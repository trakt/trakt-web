import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { LOCALE_MAP } from '$lib/utils/formatting/date/LOCALE_MAP.ts';
import { format } from 'date-fns/format';

export function toHumanDay(
  date: Date,
  localeKey: AvailableLocale,
): string {
  const locale = LOCALE_MAP[localeKey] ?? LOCALE_MAP['en'];

  return format(date, 'PPP', {
    locale,
  });
}
