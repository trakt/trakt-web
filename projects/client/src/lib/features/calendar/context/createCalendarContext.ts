import { getLocale } from '$lib/features/i18n/index.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';
import type { CalendarContext } from './CalendarContext.ts';
import { CALENDAR_CONTEXT_KEY } from './constants.ts';

type CreateCalendarContextOptions = {
  initialDate?: Date | Nil;
};

export function createCalendarContext(
  { initialDate }: CreateCalendarContextOptions = {},
) {
  const resolvedDate = initialDate ?? new Date();

  const ctx = setContext(
    CALENDAR_CONTEXT_KEY,
    getContext<CalendarContext>(CALENDAR_CONTEXT_KEY) ??
      {
        startDate: new BehaviorSubject(
          getStartOfWeek(resolvedDate, getLocale()),
        ),
        activeDate: new BehaviorSubject<Date>(resolvedDate),
        visibleDate: new BehaviorSubject<Date | null>(null),
      },
  );

  return ctx;
}
