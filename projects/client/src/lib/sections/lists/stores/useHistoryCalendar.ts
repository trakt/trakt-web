import type { Calendar } from '$lib/features/calendar/models/Calendar.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import { DAYS_IN_WEEK, HISTORY_UPPER_LIMIT } from '$lib/utils/constants.ts';
import { addDays } from 'date-fns/addDays';
import { addWeeks } from 'date-fns/addWeeks';
import { map } from 'rxjs';
import { createHistoryCalendar } from './_internal/createHistoryCalendar.ts';
import { groupHistoryByDay } from './_internal/groupHistoryByDay.ts';
import type { HistoryEntry } from './models/HistoryEntry.ts';
import {
  type RecentlyWatchedType,
  useRecentlyWatchedList,
} from './useRecentlyWatchedList.ts';

type UseHistoryCalendarParams = {
  start: Date;
  days: number;
  type: RecentlyWatchedType;
  syncId?: number;
} & FilterParams;

export function useHistoryCalendar({
  start,
  days,
  type,
  filter,
  syncId,
}: UseHistoryCalendarParams) {
  const { list, isLoading } = useRecentlyWatchedList({
    type,
    slug: 'me',
    limit: HISTORY_UPPER_LIMIT,
    filter,
    syncId,
    startDate: start,
    endDate: addDays(start, days),
    allPages: true,
  });

  const weekCount = Math.ceil(days / DAYS_IN_WEEK);

  const calendar = list.pipe(
    map((items): Calendar<HistoryEntry> => {
      const groups = groupHistoryByDay(items);

      return Array.from({ length: weekCount }, (_, week) =>
        createHistoryCalendar(groups, addWeeks(start, week)),
      ).flat();
    }),
  );

  return {
    isLoading,
    calendar,
    hasUpstreamItems: list.pipe(map((items) => items.length > 0)),
  };
}
