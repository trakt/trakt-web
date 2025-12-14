import { getLocale } from '$lib/features/i18n/index.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';
import type { ActiveDate } from './ActiveDate.ts';
import type { CalendarContext } from './CalendarContext.ts';
import { CALENDAR_CONTEXT_KEY } from './constants.ts';

export function createCalendarContext() {
  const ctx = setContext(
    CALENDAR_CONTEXT_KEY,
    getContext<CalendarContext>(CALENDAR_CONTEXT_KEY) ??
      {
        startDate: new BehaviorSubject(getStartOfWeek(new Date(), getLocale())),
        activeDate: new BehaviorSubject<ActiveDate>({
          date: new Date(),
          source: 'init',
        }),
      },
  );

  return ctx;
}
