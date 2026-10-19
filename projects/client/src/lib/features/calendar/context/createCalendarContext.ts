import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';
import type { CalendarWindow } from '../models/CalendarWindow.ts';
import type { CalendarContext } from './CalendarContext.ts';
import { CALENDAR_CONTEXT_KEY } from './constants.ts';

export function createCalendarContext(initialDate?: Date | null) {
  const anchor = initialDate ?? new Date();

  const ctx = setContext(
    CALENDAR_CONTEXT_KEY,
    getContext<CalendarContext>(CALENDAR_CONTEXT_KEY) ?? {
      range: new BehaviorSubject<CalendarWindow>({
        anchor,
        earlier: 0,
        later: 0,
      }),
      activeDate: new BehaviorSubject<Date>(anchor),
      visibleDate: new BehaviorSubject<Date | null>(null),
    },
  );

  return ctx;
}
