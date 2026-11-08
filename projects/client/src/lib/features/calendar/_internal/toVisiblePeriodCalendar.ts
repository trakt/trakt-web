import type { CalendarPeriod } from '../models/CalendarPeriod.ts';
import { dateKey } from './dateKey.ts';

type ToVisiblePeriodCalendarParams<T> = {
  periods: ReadonlyArray<CalendarPeriod<T>>;
  visibleDate: Date | Nil;
};

export function toVisiblePeriodCalendar<T>({
  periods,
  visibleDate,
}: ToVisiblePeriodCalendarParams<T>) {
  const firstPeriod = periods.at(0)?.calendar ?? [];
  if (!visibleDate) return firstPeriod;

  const scrollKey = dateKey(visibleDate);
  const match = periods.find((period) =>
    period.calendar.some((day) => dateKey(day.date) === scrollKey),
  );

  return match?.calendar ?? firstPeriod;
}
