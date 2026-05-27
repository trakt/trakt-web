import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { LOCALE_MAP } from '$lib/utils/formatting/date/LOCALE_MAP.ts';
import { addDays } from 'date-fns/addDays';
import { endOfMonth } from 'date-fns/endOfMonth';
import { isSameDay } from 'date-fns/isSameDay';
import { startOfMonth } from 'date-fns/startOfMonth';
import { startOfWeek } from 'date-fns/startOfWeek';
import { dateKey } from './dateKey.ts';

export type MonthCell<T> = {
  date: Date;
  items: T[];
  isOutsideMonth: boolean;
};

export type MonthMatrix<T> = {
  weeks: MonthCell<T>[][];
  activeWeekIndex: number;
};

type BuildMonthMatrixParams<T> = {
  referenceDate: Date;
  activeDate: Date;
  allDays: ReadonlyArray<{ date: Date; items: T[] }>;
  localeKey?: AvailableLocale;
};

/**
 * Builds a month-grid matrix for the month containing `referenceDate`.
 *
 * - Rows are full weeks starting at the locale's first weekday.
 * - The first row may include trailing days from the previous month (these
 *   carry `isOutsideMonth: true`).
 * - The last row is truncated at the month's last day, matching the design.
 * - `activeWeekIndex` is the row index whose week contains `activeDate`,
 *   or `-1` if no row does.
 */
export function buildMonthMatrix<T>(
  { referenceDate, activeDate, allDays, localeKey = 'en' }:
    BuildMonthMatrixParams<T>,
): MonthMatrix<T> {
  const locale = LOCALE_MAP[localeKey] ?? LOCALE_MAP['en'];

  const monthStart = startOfMonth(referenceDate);
  const monthEnd = endOfMonth(referenceDate);
  const gridStart = startOfWeek(monthStart, { locale });

  const dayMap = new Map(
    allDays.map((day) => [dateKey(day.date), day.items] as const),
  );

  const weeks: MonthCell<T>[][] = [];
  let activeWeekIndex = -1;
  let cursor = gridStart;

  while (cursor <= monthEnd) {
    const week: MonthCell<T>[] = [];
    let weekHasActive = false;

    for (let i = 0; i < 7; i++) {
      const d = addDays(cursor, i);
      if (d > monthEnd) break;

      week.push({
        date: d,
        items: dayMap.get(dateKey(d)) ?? [],
        isOutsideMonth: d.getMonth() !== referenceDate.getMonth(),
      });

      if (isSameDay(d, activeDate)) {
        weekHasActive = true;
      }
    }

    if (weekHasActive) {
      activeWeekIndex = weeks.length;
    }

    weeks.push(week);
    cursor = addDays(cursor, 7);
  }

  return { weeks, activeWeekIndex };
}
