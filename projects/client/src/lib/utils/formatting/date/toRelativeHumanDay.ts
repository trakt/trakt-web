import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { differenceInCalendarDays } from 'date-fns/differenceInCalendarDays';
import { format } from 'date-fns/format';
import { LOCALE_MAP } from './LOCALE_MAP.ts';
import { isInRelativeRange } from './_internal/isInRelativeRange.ts';

function formatRelativeDay(
  today: Date,
  date: Date,
  localeKey: AvailableLocale,
) {
  const dayDiff = differenceInCalendarDays(date, today);

  const relativeFormatter = new Intl.RelativeTimeFormat(localeKey, {
    numeric: 'auto',
  });

  if (dayDiff >= -1 && dayDiff <= 1) {
    return relativeFormatter.format(dayDiff, 'day');
  }

  const weekdayFormatter = new Intl.DateTimeFormat(localeKey, {
    weekday: 'long',
  });

  const weekday = weekdayFormatter.format(date);
  return dayDiff < 0
    ? m.text_last_day({ day: weekday })
    : m.text_next_day({ day: weekday });
}

export function toRelativeHumanDay(
  today: Date,
  date: Date,
  localeKey: AvailableLocale,
): string {
  const locale = LOCALE_MAP[localeKey] ?? LOCALE_MAP['en'];

  if (isInRelativeRange(today, date)) {
    return formatRelativeDay(today, date, localeKey);
  }

  return format(date, 'PPP', {
    locale,
  });
}
