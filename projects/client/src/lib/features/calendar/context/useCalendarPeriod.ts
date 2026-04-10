import { getLocale } from '$lib/features/i18n/index.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { isCurrentWeek } from '$lib/utils/date/isCurrentWeek.ts';
import { addDays } from 'date-fns/addDays';
import { addWeeks } from 'date-fns/addWeeks';
import { subWeeks } from 'date-fns/subWeeks';
import { map } from 'rxjs';
import { AnalyticsEvent } from '../../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../analytics/useTrack.ts';
import { createCalendarAccumulator } from '../_internal/createCalendarAccumulator.ts';
import type { CalendarOrder } from '../models/CalendarOrder.ts';
import { getCalendarContext } from './getCalendarContext.ts';

type Direction = 'next' | 'previous';

function getNextOrPreviousPeriod(date: Date, direction: Direction) {
  const weekStart = getStartOfWeek(date, getLocale());
  const targetWeek = direction === 'previous'
    ? subWeeks(weekStart, 1)
    : addWeeks(weekStart, 1);

  return getStartOfWeek(targetWeek, getLocale());
}

const LAST_DAY_OF_WEEK_OFFSET = 6;

function getActiveDate(weekStart: Date, order: CalendarOrder): Date {
  if (order === 'reverse-chronological') {
    return addDays(weekStart, LAST_DAY_OF_WEEK_OFFSET);
  }

  return weekStart;
}

// FIXME: calendar navigation should be reflected in url
export function useCalendarPeriod(
  options?: { order?: CalendarOrder },
) {
  const { order = 'chronological' } = options ?? {};
  const { startDate, activeDate, visibleDate } = getCalendarContext();
  const { track } = useTrack(AnalyticsEvent.CalendarPeriod);
  const { accumulate, clear, canLoadMore } = createCalendarAccumulator(order);

  const navigate = (direction: Direction) => {
    track({ action: direction });
    const referenceDate = visibleDate.value ?? startDate.value;
    const newStart = getNextOrPreviousPeriod(referenceDate, direction);

    clear(newStart);
    visibleDate.next(null);
    activeDate.next(getActiveDate(newStart, order));
    startDate.next(newStart);
  };

  const loadMore = () => {
    if (!canLoadMore()) {
      return;
    }

    const direction: Direction = order === 'chronological'
      ? 'next'
      : 'previous';
    const newStart = getNextOrPreviousPeriod(startDate.value, direction);
    startDate.next(newStart);
  };

  const reset = () => {
    track({ action: 'reset' });
    const referenceDate = visibleDate.value ?? startDate.value;

    if (isCurrentWeek(referenceDate, getLocale())) {
      activeDate.next(new Date());
      return;
    }

    const newStart = getStartOfWeek(new Date(), getLocale());
    clear(newStart);
    visibleDate.next(null);
    startDate.next(newStart);
    activeDate.next(new Date());
  };

  return {
    startDate: startDate.asObservable(),
    endDate: startDate.pipe(map((date) => addWeeks(date, 1))),
    next: () => navigate('next'),
    previous: () => navigate('previous'),
    loadMore,
    accumulate,
    activeDate,
    reset,
  };
}
