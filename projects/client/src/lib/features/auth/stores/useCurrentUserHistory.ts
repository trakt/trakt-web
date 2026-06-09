import { useAllPagesInfiniteQuery } from '$lib/features/query/useQuery.ts';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  shareReplay,
} from 'rxjs';
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

function toWatchedMap<T extends { id: number }>(
  entries: T[],
): Map<number, T> {
  return new Map(entries.map((entry) => [entry.id, entry]));
}

function toQueryMap<T extends { id: number }>(
  query: { data?: { pages: Array<{ entries: T[] }> } },
): Map<number, T> {
  return toWatchedMap(query.data?.pages.flatMap((p) => p.entries) ?? []);
}

function isSettled(
  query: { isPending: boolean; isFetchingNextPage: boolean },
): boolean {
  return !query.isPending && !query.isFetchingNextPage;
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
    map(([movies, shows]) => {
      if (!isSettled(movies) || !isSettled(shows)) {
        return null;
      }

      const moviesMap = toQueryMap(movies);
      const showsMap = toQueryMap(shows);

      return {
        movies: moviesMap,
        shows: showsMap,
      };
    }),
    distinctUntilChanged((prev, curr) => prev === null && curr === null),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  const isLoading = combineLatest([moviesQuery, showsQuery]).pipe(
    map(([movies, shows]) => !isSettled(movies) || !isSettled(shows)),
  );

  return { history, isLoading };
}
