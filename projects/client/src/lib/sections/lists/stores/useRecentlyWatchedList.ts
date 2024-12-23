import type { MediaType } from '$lib/models/MediaType.ts';
import {
  movieHistoryQuery,
} from '$lib/requests/queries/users/movieHistoryQuery.ts';
import {
  showHistoryQuery,
} from '$lib/requests/queries/users/showHistoryQuery.ts';
import { getPastMonthRange } from '$lib/utils/date/getPastMonthRange.ts';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

const HISTORY_LIMIT = 1000;

export type RecentlyWatchedListStoreProps = {
  type: MediaType;
};

function getQueryParams() {
  return {
    ...getPastMonthRange(new Date()),
    limit: HISTORY_LIMIT,
  };
}

function useRecentlyWatchedMovies() {
  const query = createQuery({
    ...movieHistoryQuery(getQueryParams()),
    staleTime: time.hours(1),
  });

  return {
    list: derived(
      query,
      ($query) => ($query.data ?? []).map((item) => item.movie),
    ),
  };
}

function useRecentlyWatchedShows() {
  const query = createQuery({
    ...showHistoryQuery(getQueryParams()),
    staleTime: time.hours(1),
  });

  /*
    These are returned on a per episode basis,
    so we need to filter out duplicate shows.
    They are ordered by most recent, so we keep
    the first occurrence of each show.
  */
  return {
    list: derived(
      query,
      ($query) =>
        ($query.data ?? [])
          .map((item) => item.show)
          .filter((item, index, self) =>
            self.findIndex((t) => t.id === item.id) === index
          ),
    ),
  };
}

export function useRecentlyWatchedList(params: RecentlyWatchedListStoreProps) {
  switch (params.type) {
    case 'movie':
      return useRecentlyWatchedMovies();
    case 'show':
      return useRecentlyWatchedShows();
    case 'episode':
      throw new Error('Not implemented');
  }
}
