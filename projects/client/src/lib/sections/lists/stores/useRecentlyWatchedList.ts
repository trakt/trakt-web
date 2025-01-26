import { useQuery } from '$lib/features/query/useQuery';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry';
import type { MediaEntry } from '$lib/requests/models/MediaEntry';
import { episodeHistoryQuery } from '$lib/requests/queries/users/episodeHistoryQuery';
import {
  movieHistoryQuery,
} from '$lib/requests/queries/users/movieHistoryQuery.ts';
import { getPastMonthRange } from '$lib/utils/date/getPastMonthRange.ts';
import { derived, type Readable } from 'svelte/store';

const HISTORY_LIMIT = 1000;

type RecentlyWatchedListStoreProps = {
  type: 'movie' | 'episode';
};

type WatchedMovie = {
  id: number;
  movie: MediaEntry;
  type: 'movie';
};

type WatchedEpisode = {
  id: number;
  episode: EpisodeEntry;
  show: MediaEntry;
  type: 'episode';
};

type RecentlyWatched = {
  list: Readable<(WatchedMovie | WatchedEpisode)[]>;
};

function getQueryParams() {
  return {
    ...getPastMonthRange(new Date()),
    limit: HISTORY_LIMIT,
  };
}

export function useRecentlyWatchedMovies() {
  const query = useQuery(movieHistoryQuery(getQueryParams()));

  return {
    list: derived(
      query,
      ($query) =>
        ($query.data ?? [])
          .map((item): WatchedMovie => ({
            id: item.id,
            movie: item.movie,
            type: 'movie',
          })),
    ),
  };
}

export function useRecentlyWatchedEpisodes() {
  const query = useQuery(episodeHistoryQuery(getQueryParams()));

  return {
    list: derived(
      query,
      ($query) => {
        return ($query.data ?? [])
          .map((item): WatchedEpisode => ({
            id: item.id,
            episode: item.episode,
            show: item.show,
            type: 'episode',
          }));
      },
    ),
  };
}

export function useRecentlyWatchedList(
  params: RecentlyWatchedListStoreProps,
): RecentlyWatched {
  switch (params.type) {
    case 'movie':
      return useRecentlyWatchedMovies();
    case 'episode':
      return useRecentlyWatchedEpisodes();
  }
}
