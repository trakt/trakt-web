import { flattenQueryPages } from '$lib/features/query/flattenQueryPages.ts';
import { isQuerySettled } from '$lib/features/query/isQuerySettled.ts';
import { settledData } from '$lib/features/query/settledData.ts';
import { useAllPagesInfiniteQuery } from '$lib/features/query/useQuery.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import { combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';
import {
  currentUserWatchedMoviesQuery,
  type WatchedMovie,
} from '../queries/currentUserWatchedMoviesQuery.ts';
import {
  currentUserWatchedShowsQuery,
  type WatchedShow,
} from '../queries/currentUserWatchedShowsQuery.ts';

const showsHistoryLimit = 1000;
const moviesHistoryLimit = 10000;

export type UserHistory = {
  movies: Map<number, WatchedMovie>;
  shows: Map<number, WatchedShow>;
};

function toWatchedMap<T extends { id: number }>(entries: T[]): Map<number, T> {
  return new Map(entries.map((entry) => [entry.id, entry]));
}

type UseCurrentUserHistoryResult = {
  history: Observable<UserHistory | null>;
  isLoading: Observable<boolean>;
};

export function useCurrentUserHistory(): UseCurrentUserHistoryResult {
  const moviesQuery = useAllPagesInfiniteQuery(
    currentUserWatchedMoviesQuery({ limit: moviesHistoryLimit }),
  );
  const showsQuery = useAllPagesInfiniteQuery(
    currentUserWatchedShowsQuery({ limit: showsHistoryLimit }),
  );

  const history = combineLatest([moviesQuery, showsQuery]).pipe(
    map(
      ([movies, shows]) => [settledData(movies), settledData(shows)] as const,
    ),
    distinctUntilChanged(
      ([prevMovies, prevShows], [movies, shows]) =>
        prevMovies === movies && prevShows === shows,
    ),
    map(([movies, shows]) => {
      if (movies === null || shows === null) {
        return null;
      }

      return {
        movies: toWatchedMap(flattenQueryPages({ data: movies })),
        shows: toWatchedMap(flattenQueryPages({ data: shows })),
      };
    }),
    distinctUntilChanged((prev, curr) => prev === null && curr === null),
    multicast(),
  );

  const isLoading = combineLatest([moviesQuery, showsQuery]).pipe(
    map(([movies, shows]) => !isQuerySettled(movies) || !isQuerySettled(shows)),
  );

  return { history, isLoading };
}
