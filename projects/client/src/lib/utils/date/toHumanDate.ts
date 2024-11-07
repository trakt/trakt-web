import { formatRelative } from 'date-fns/formatRelative';
import { format } from 'date-fns/format';
import { intervalToDuration } from 'date-fns/intervalToDuration';
import { LOCALE_MAP } from '$lib/utils/date/LOCALE_MAP.ts';

export function toHumanDate(
  today: Date,
  date: Date,
  localeKey: string,
): string {
  const locale = LOCALE_MAP[localeKey] ?? LOCALE_MAP['en'];

  const { days = 0 } = intervalToDuration({
    start: today,
    end: date,
  });

  const isInRelativeRange = days >= -6 && days <= 6;

  if (isInRelativeRange) {
    return formatRelative(date, today, {
      locale,
    });
  }

  return format(date, 'PPPp', {
    locale,
  });
}
