import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import {
  type UpcomingEpisodeEntry,
  upcomingEpisodesQuery,
} from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import { upcomingMoviesQuery } from '$lib/requests/queries/calendars/upcomingMoviesQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';
import { upcomingMediaQuery } from '../../../requests/queries/calendars/upcomingMediaQuery.ts';

type UpcomingList = Array<MediaEntry | UpcomingEpisodeEntry>;

const ONE_DAY = 1000 * 60 * 60 * 24;
const DAYS_TO_FETCH = 14;

function daysAgo(days: number) {
  return new Date(Date.now() - ONE_DAY * days);
}

function getUpcomingCalendarQuery(
  startDate: string,
  type: DiscoverMode,
) {
  const params = {
    startDate,
    days: DAYS_TO_FETCH,
  };

  switch (type) {
    case 'movie':
      return upcomingMoviesQuery(params) as CreateQueryOptions<UpcomingList>;
    case 'show':
      return upcomingEpisodesQuery(params) as CreateQueryOptions<UpcomingList>;
    default:
      return upcomingMediaQuery(params) as CreateQueryOptions<UpcomingList>;
  }
}

export function useUpcomingItems(type: DiscoverMode) {
  const [YYYY_MM_DD] = daysAgo(0).toISOString().split('T');
  const startDate = assertDefined(
    YYYY_MM_DD,
    'Could not extract current date.',
  );

  const query = useQuery(getUpcomingCalendarQuery(startDate, type));

  const isLoading = derived(
    [query],
    ([$query]) => $query.isLoading,
  );

  const upcoming = derived(
    query,
    ($query) =>
      ($query.data ?? []).filter((d) => {
        const distanceFromNow = d.airDate.getTime() - Date.now();
        return distanceFromNow > 0;
      }),
  );

  return { upcoming, isLoading };
}
