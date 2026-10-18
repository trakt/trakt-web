import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { addDays } from 'date-fns/addDays';
import { differenceInCalendarDays } from 'date-fns/differenceInCalendarDays';
import { endOfMonth } from 'date-fns/endOfMonth';
import { isSameDay } from 'date-fns/isSameDay';
import { startOfMonth } from 'date-fns/startOfMonth';
import { dateKey } from '../../_internal/dateKey.ts';

type MonthCell<T> = {
  date: Date;
  items: T[];
  isOutsideMonth: boolean;
};

type MonthWeek<T> = {
  key: string;
  cells: ReadonlyArray<MonthCell<T>>;
};

type MonthMatrix<T> = {
  weeks: ReadonlyArray<MonthWeek<T>>;
  activeWeekIndex: number;
};

type BuildMonthMatrixParams<T> = {
  referenceDate: Date;
  activeDate: Date;
  allDays: ReadonlyArray<{ date: Date; items: T[] }>;
  localeKey?: AvailableLocale;
};

const DAYS_IN_WEEK = 7;

export function buildMonthMatrix<T>({
  referenceDate,
  activeDate,
  allDays,
  localeKey = 'en',
}: BuildMonthMatrixParams<T>): MonthMatrix<T> {
  const monthEnd = endOfMonth(referenceDate);
  const gridStart = getStartOfWeek(startOfMonth(referenceDate), localeKey);
  const weekCount = Math.ceil(
    (differenceInCalendarDays(monthEnd, gridStart) + 1) / DAYS_IN_WEEK,
  );

  const dayMap = new Map(
    allDays.map((day) => [dateKey(day.date), day.items] as const),
  );

  const toCell = (date: Date): MonthCell<T> => ({
    date,
    items: dayMap.get(dateKey(date)) ?? [],
    isOutsideMonth: date.getMonth() !== referenceDate.getMonth(),
  });

  const weeks = Array.from({ length: weekCount }, (_, week) => {
    const weekStart = addDays(gridStart, week * DAYS_IN_WEEK);

    return {
      key: dateKey(weekStart),
      cells: Array.from({ length: DAYS_IN_WEEK }, (_, day) =>
        addDays(weekStart, day),
      )
        .filter((date) => date <= monthEnd)
        .map(toCell),
    };
  });

  const activeWeekIndex = weeks.findIndex((week) =>
    week.cells.some((cell) => isSameDay(cell.date, activeDate)),
  );

  return { weeks, activeWeekIndex };
}
