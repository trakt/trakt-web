import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { addDays } from 'date-fns/addDays';
import { differenceInCalendarDays } from 'date-fns/differenceInCalendarDays';

type CalendarWeekTitleParams = {
  start: Date;
  today: Date;
  locale: AvailableLocale;
};

const DAYS_IN_WEEK = 7;

const RELATIVE_WEEK_TITLES = new Map<number, () => string>([
  [-1, m.header_calendar_last_week],
  [0, m.header_calendar_this_week],
  [1, m.header_calendar_next_week],
]);

export function toCalendarWeekTitle(
  { start, today, locale }: CalendarWeekTitleParams,
): string {
  const weekStart = getStartOfWeek(start, locale);
  const weekOffset = Math.round(
    differenceInCalendarDays(weekStart, getStartOfWeek(today, locale)) /
      DAYS_IN_WEEK,
  );

  const relativeTitle = RELATIVE_WEEK_TITLES.get(weekOffset);
  if (relativeTitle) return relativeTitle();

  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' })
    .formatRange(weekStart, addDays(weekStart, DAYS_IN_WEEK - 1));
}
