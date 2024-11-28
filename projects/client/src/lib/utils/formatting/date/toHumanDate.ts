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
  localeKey: string,
): string {
  const locale = LOCALE_MAP[localeKey] ?? LOCALE_MAP['en'];

  const { days = 0 } = intervalToDuration({
    start: stripTime(today),
    end: stripTime(date),
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
