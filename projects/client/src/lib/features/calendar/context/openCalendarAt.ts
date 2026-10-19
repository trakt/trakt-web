import type { CalendarContext } from './CalendarContext.ts';

export function openCalendarAt(
  { range, activeDate, visibleDate }: CalendarContext,
  date: Date,
) {
  visibleDate.next(null);
  activeDate.next(date);
  range.next({ anchor: date, earlier: 0, later: 0 });
}
