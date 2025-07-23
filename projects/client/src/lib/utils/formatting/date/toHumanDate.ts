import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { format } from 'date-fns/format';
import { formatRelative } from 'date-fns/formatRelative';
import { intervalToDuration } from 'date-fns/intervalToDuration';
import { LOCALE_MAP } from './LOCALE_MAP.ts';

function stripTime(date: Date): Date {
  return new Date(date.toDateString());
}

export function toHumanDate(
  today: Date,
  date: Date,
  localeKey: AvailableLocale,
): string {
  const locale = LOCALE_MAP[localeKey] ?? LOCALE_MAP['en'];

  const { days = 0, months = 0, years = 0 } = intervalToDuration({
    start: stripTime(today),
    end: stripTime(date),
  });

  const isInMonthRange = years === 0 && months === 0;
  const isInDaysRange = days >= -6 && days <= 6;
  const isInRelativeRange = isInMonthRange && isInDaysRange;

  if (isInRelativeRange) {
    return formatRelative(date, today, {
      locale,
    });
  }

  return format(date, 'PPPp', {
    locale,
  });
}
