import { getLocale } from '$lib/features/i18n/index.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { isCurrentWeek } from '$lib/utils/date/isCurrentWeek.ts';
import { addWeeks } from 'date-fns/addWeeks';
import { subWeeks } from 'date-fns/subWeeks';
import { map } from 'rxjs';
import { AnalyticsEvent } from '../../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../analytics/useTrack.ts';
import { getCalendarContext } from './getCalendarContext.ts';

type Direction = 'next' | 'previous';

function getNextOrPreviousPeriod(date: Date, direction: Direction) {
  const weekStart = getStartOfWeek(date, getLocale());
  const targetWeek = direction === 'previous'
    ? subWeeks(weekStart, 1)
    : addWeeks(weekStart, 1);

  return getStartOfWeek(targetWeek, getLocale());
}

// FIXME: calendar navigation should be reflected in url
export function useCalendarPeriod() {
  const { startDate, activeDate } = getCalendarContext();
  const { track } = useTrack(AnalyticsEvent.CalendarPeriod);

  const switchPeriod = (direction: Direction) => {
    track({ action: direction });
    const date = startDate.value;
    const newStart = getNextOrPreviousPeriod(date, direction);

    activeDate.next(newStart);
    startDate.next(newStart);
  };

  const reset = () => {
    track({ action: 'reset' });
    if (isCurrentWeek(startDate.value, getLocale())) {
      activeDate.next(new Date());
      return;
    }

    startDate.next(getStartOfWeek(new Date(), getLocale()));
    activeDate.next(new Date());
  };

  return {
    startDate: startDate.asObservable(),
    endDate: startDate.pipe(map((date) => addWeeks(date, 1))),
    next: () => switchPeriod('next'),
    previous: () => switchPeriod('previous'),
    activeDate,
    reset,
  };
}
