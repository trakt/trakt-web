import { useQuery } from '$lib/features/query/useQuery.ts';
import {
  type ReleasesCalendarEntry,
  releasesCalendarQuery,
} from '$lib/requests/queries/calendars/releasesCalendarQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { isSameDay } from 'date-fns/isSameDay';
import { map, type Observable } from 'rxjs';
import type { FilterParams } from '../../../requests/models/FilterParams.ts';
import type { DiscoverMode } from '../../discover/models/DiscoverMode.ts';
import type { Calendar } from '../models/Calendar.ts';

const releasesCalendarSourceLimit = 50;

type UseReleasesCalendarParams = {
  start: Date;
  days: number;
  type: DiscoverMode;
} & FilterParams;

type ReleasesCalendarResult = {
  isLoading: Observable<boolean>;
  calendar: Observable<Calendar<ReleasesCalendarEntry>>;
};

export function useReleasesCalendar(
  props: UseReleasesCalendarParams,
): ReleasesCalendarResult {
  const [yyyyMmDd] = props.start.toISOString().split('T');
  const startDate = assertDefined(
    yyyyMmDd,
    'Could not extract start date.',
  );

  const query = useQuery(
    releasesCalendarQuery({
      startDate,
      days: props.days,
      type: props.type,
      filter: props.filter,
      filterOverride: props.filterOverride,
      sourceLimit: releasesCalendarSourceLimit,
    }),
  );

  const isLoading = query.pipe(
    map(toLoadingState),
  );

  return {
    isLoading,
    calendar: query.pipe(
      map(($query) => $query.data ?? []),
      map(($items) =>
        Array.from({ length: props.days }, (_, i) => {
          const date = new Date(props.start);
          date.setDate(props.start.getDate() + i);

          const items = $items.filter(
            (item) => isSameDay(item.effectiveReleaseDate, date),
          );

          return { date, items };
        })
      ),
    ),
  };
}
