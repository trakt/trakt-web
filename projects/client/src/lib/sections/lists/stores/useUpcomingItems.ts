import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { episodeWithShowOrMovieTargets } from '$lib/features/intl-overlay/episodeWithShowOrMovieTargets.ts';
import { withBulkIntlOverlay } from '$lib/features/intl-overlay/withBulkIntlOverlay.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import {
  type UpcomingEpisodeEntry,
  upcomingEpisodesQuery,
} from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import { upcomingMediaQuery } from '$lib/requests/queries/calendars/upcomingMediaQuery.ts';
import { upcomingMoviesQuery } from '$lib/requests/queries/calendars/upcomingMoviesQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { CreateQueryOptions } from '$lib/features/query/types.ts';
import { map } from 'rxjs';

type UseUpcomingItemsProps = {
  type: DiscoverMode;
  limit: number;
} & FilterParams;

type UpcomingList = Array<MediaEntry | UpcomingEpisodeEntry>;

const daysToFetch = 14;

function daysAgo(days: number) {
  return new Date(Date.now() - time.days(days));
}

function getUpcomingCalendarQuery(
  startDate: string,
  props: UseUpcomingItemsProps,
) {
  const params = {
    startDate,
    days: daysToFetch,
    filter: props.filter,
  };

  switch (props.type) {
    case 'movie':
      return upcomingMoviesQuery(params) as CreateQueryOptions<UpcomingList>;
    case 'show':
      return upcomingEpisodesQuery(params) as CreateQueryOptions<UpcomingList>;
    default:
      return upcomingMediaQuery(params) as CreateQueryOptions<UpcomingList>;
  }
}

export function useUpcomingItems(props: UseUpcomingItemsProps) {
  const [YYYY_MM_DD] = daysAgo(0).toISOString().split('T');
  const startDate = assertDefined(
    YYYY_MM_DD,
    'Could not extract current date.',
  );

  const query = useQuery(getUpcomingCalendarQuery(startDate, props));

  const isLoading = query.pipe(map(($query) => $query.isLoading));

  const list = query.pipe(
    map(($query) =>
      ($query.data ?? [])
        .filter((d) => d.effectiveReleaseDate.getTime() > Date.now())
        .slice(0, props.limit)
    ),
    withBulkIntlOverlay<MediaEntry | UpcomingEpisodeEntry>({
      getTargets: episodeWithShowOrMovieTargets,
    }),
  );

  return { list, isLoading };
}
