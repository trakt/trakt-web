import { getLocale } from '$lib/features/i18n/index.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { isCurrentWeek } from '$lib/utils/date/isCurrentWeek.ts';
import { addWeeks } from 'date-fns/addWeeks';
import { subWeeks } from 'date-fns/subWeeks';
import { AnalyticsEvent } from '../../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../analytics/useTrack.ts';
import { getCalendarContext } from './getCalendarContext.ts';

type Direction = 'next' | 'previous';

const PERIOD_DAYS = 7;

function getNextOrPreviousPeriod(date: Date, direction: Direction) {
  const weekStart = getStartOfWeek(date, getLocale());
  const targetWeek = direction === 'previous'
    ? subWeeks(weekStart, 1)
    : addWeeks(weekStart, 1);

  return getStartOfWeek(targetWeek, getLocale());
}

export function useCalendarPeriod() {
  const { startDate, activeDate } = getCalendarContext();
  const { track } = useTrack(AnalyticsEvent.CalendarPeriod);

  const switchPeriod = (direction: Direction) => {
    track({ action: direction });
    const date = startDate.value;
    const newStart = getNextOrPreviousPeriod(date, direction);

    activeDate.next({ date: newStart, source: 'navigation' });
    startDate.next(newStart);
  };

  const reset = () => {
    track({ action: 'reset' });
    if (isCurrentWeek(startDate.value, getLocale())) {
      activeDate.next({ date: new Date(), source: 'navigation' });
      return;
    }

    startDate.next(getStartOfWeek(new Date(), getLocale()));
    activeDate.next({ date: new Date(), source: 'init' });
  };

  return {
    startDate: startDate.asObservable(),
    next: () => switchPeriod('next'),
    previous: () => switchPeriod('previous'),
    activeDate,
    reset,
    days: PERIOD_DAYS,
  };
}
