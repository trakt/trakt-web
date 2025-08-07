import { getContext } from 'svelte';
import type { CalendarContext } from './CalendarContext.ts';
import { CALENDAR_CONTEXT_KEY } from './constants.ts';

export function getCalendarContext() {
  const context = getContext<CalendarContext>(CALENDAR_CONTEXT_KEY);
  if (!context) {
    throw new Error(
      'Calendar context not found. Make sure to call use this within the CalendarProvider scope.',
    );
  }
  return context;
}
