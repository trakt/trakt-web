import { createBulkIntlOverlay } from '$lib/features/intl-overlay/createBulkIntlOverlay.ts';
import { episodeWithShowOrMovieTargets } from '$lib/features/intl-overlay/episodeWithShowOrMovieTargets.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import {
  type ReleasesCalendarEntry,
  releasesCalendarQuery,
} from '$lib/requests/queries/calendars/releasesCalendarQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, type Observable } from 'rxjs';
import type { FilterParams } from '../../../requests/models/FilterParams.ts';
import type { DiscoverMode } from '../../filters/models/DiscoverMode.ts';
import { filterByEpisodeType } from '../filterByEpisodeType.ts';
import type { Calendar } from '../models/Calendar.ts';
import type { EpisodeTypeFilter } from '../models/EpisodeTypeFilter.ts';
import { toCalendar } from './toCalendar.ts';

type UseReleasesCalendarParams = {
  start: Date;
  days: number;
  type: DiscoverMode;
  episodeType: Observable<EpisodeTypeFilter>;
} & FilterParams;

type ReleasesCalendarResult = {
  isLoading: Observable<boolean>;
  calendar: Observable<Calendar<ReleasesCalendarEntry>>;
  hasUpstreamItems: Observable<boolean>;
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
    }),
  );

  const baseLoading = query.pipe(
    map(toLoadingState),
  );

  const overlay = createBulkIntlOverlay<ReleasesCalendarEntry>({
    getTargets: episodeWithShowOrMovieTargets,
  });

  const items = query.pipe(
    map(($query) => $query.data ?? []),
  );

  const filteredItems = items.pipe(
    filterByEpisodeType(props.episodeType),
    overlay.operator,
  );

  return {
    isLoading: withOverlayLoading(baseLoading, overlay.intlLoading$),
    hasUpstreamItems: items.pipe(map(($items) => $items.length > 0)),
    calendar: filteredItems.pipe(
      map(($items) =>
        toCalendar({
          items: $items,
          start: props.start,
          days: props.days,
        })
      ),
    ),
  };
}
