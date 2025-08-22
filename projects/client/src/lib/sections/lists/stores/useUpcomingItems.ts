import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import {
  type UpcomingEpisodeEntry,
  upcomingEpisodesQuery,
} from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import { upcomingMoviesQuery } from '$lib/requests/queries/calendars/upcomingMoviesQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

type UpcomingList = Array<MediaEntry | UpcomingEpisodeEntry>;

const ONE_DAY = 1000 * 60 * 60 * 24;
const DAYS_TO_FETCH = 14;

function daysAgo(days: number) {
  return new Date(Date.now() - ONE_DAY * days);
}

function getUpcomingCalendarQueries(startDate: string) {
  const params = {
    startDate,
    days: DAYS_TO_FETCH,
  };

  return [
    upcomingEpisodesQuery(params) as CreateQueryOptions<UpcomingList>,
    upcomingMoviesQuery(params) as CreateQueryOptions<UpcomingList>,
  ];
}

export function useUpcomingItems() {
  const [YYYY_MM_DD] = daysAgo(0).toISOString().split('T');
  const startDate = assertDefined(
    YYYY_MM_DD,
    'Could not extract current date.',
  );

  const queries = getUpcomingCalendarQueries(startDate)
    .map((query) => useQuery(query));

  const isLoading = derived(
    queries,
    ($queries) => $queries.some(toLoadingState),
  );

  const allItems = derived(
    queries,
    ($queries) =>
      $queries
        .flatMap((query) => query.data ?? [])
        .sort((a, b) => {
          return new Date(a.airDate).getTime() - new Date(b.airDate).getTime();
        }),
  );

  const upcoming = derived(
    allItems,
    ($allItems) =>
      $allItems.filter((d) => {
        const distanceFromNow = d.airDate.getTime() - Date.now();
        return distanceFromNow > 0;
      }),
  );

  return { upcoming, isLoading };
}
