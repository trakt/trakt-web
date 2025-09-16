import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { format } from 'date-fns/format';
import { formatRelative } from 'date-fns/formatRelative';
import { LOCALE_MAP } from './LOCALE_MAP.ts';
import { isInRelativeRange } from './_internal/isInRelativeRange.ts';

export function toHumanDate(
  today: Date,
  date: Date,
  localeKey: AvailableLocale,
): string {
  const locale = LOCALE_MAP[localeKey] ?? LOCALE_MAP['en'];

  if (isInRelativeRange(today, date)) {
    return formatRelative(date, today, {
      locale,
    });
  }

  return format(date, 'PPPp', {
    locale,
  });
}
