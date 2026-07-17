import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { filterWatchedCalendarItems } from '$lib/features/calendar/filterWatchedCalendarItems.ts';
import { filterWatchlistedCalendarItems } from '$lib/features/calendar/filterWatchlistedCalendarItems.ts';
import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { createBulkIntlOverlay } from '$lib/features/intl-overlay/createBulkIntlOverlay.ts';
import { episodeWithShowOrMovieTargets } from '$lib/features/intl-overlay/episodeWithShowOrMovieTargets.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import {
  type ReleasesCalendarEntry,
  releasesCalendarQuery,
} from '$lib/requests/queries/calendars/releasesCalendarQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { map } from 'rxjs';
import { filterReleasesItems } from './_internal/filterReleasesItems.ts';

type UseReleasesItemsProps = {
  type: DiscoverMode;
  limit: number;
} & FilterParams;

const daysToFetch = 30;

export function useReleasesItems(props: UseReleasesItemsProps) {
  const [yyyyMmDd] = new Date().toISOString().split('T');
  const startDate = assertDefined(
    yyyyMmDd,
    'Could not extract current date.',
  );

  const query = useQuery(
    releasesCalendarQuery({
      startDate,
      days: daysToFetch,
      type: props.type,
      filter: props.filter,
      filterOverride: props.filterOverride,
    }),
  );

  const { history, watchlist } = useUser();

  const overlay = createBulkIntlOverlay<ReleasesCalendarEntry>({
    getTargets: episodeWithShowOrMovieTargets,
  });

  const baseLoading = query.pipe(map(($query) => $query.isLoading));

  const entries = query.pipe(map(($query) => $query.data ?? []));

  const unwatchedEntries = filterWatchedCalendarItems({
    items: entries,
    history,
    filter: props.filter,
  });

  const visibleEntries = filterWatchlistedCalendarItems({
    items: unwatchedEntries,
    watchlist,
    filter: props.filter,
  });

  const list = visibleEntries.pipe(
    map(($entries) =>
      filterReleasesItems({
        entries: $entries,
        limit: props.limit,
        now: new Date(),
      })
    ),
    overlay.operator,
  );

  return {
    list,
    isLoading: withOverlayLoading(baseLoading, overlay.intlLoading$),
  };
}
