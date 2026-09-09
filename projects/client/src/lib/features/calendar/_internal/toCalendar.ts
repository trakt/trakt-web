import { addDays } from '$lib/utils/date/addDays.ts';
import { isSameDay } from 'date-fns/isSameDay';
import type { Calendar } from '../models/Calendar.ts';

type ToCalendarParams<T> = {
  items: ReadonlyArray<T>;
  start: Date;
  days: number;
};

export function toCalendar<T extends { effectiveReleaseDate: Date }>(
  { items, start, days }: ToCalendarParams<T>,
): Calendar<T> {
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(start, i);

    return {
      date,
      items: items.filter((item) => isSameDay(item.effectiveReleaseDate, date)),
    };
  });
}
