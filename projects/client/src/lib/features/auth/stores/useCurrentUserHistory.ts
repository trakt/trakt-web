import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
import { combineLatest, distinctUntilChanged, map, Observable, tap } from 'rxjs';
import {
  currentUserWatchedMoviesQuery,
  type WatchedMovie,
} from '../queries/currentUserWatchedMoviesQuery.ts';
import {
  currentUserWatchedShowsQuery,
  type WatchedShow,
} from '../queries/currentUserWatchedShowsQuery.ts';

const historyLimit = 1000;

export type UserHistory = {
  movies: Map<number, WatchedMovie>;
  shows: Map<number, WatchedShow>;
  lastWatchedAt: Date | null;
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

// FIXME: this can go when history is paginated properly
function getLastWatchedAt(
  movies: Map<number, WatchedMovie>,
  shows: Map<number, WatchedShow>,
): Date | null {
  if (movies.size === 0 && shows.size === 0) return null;

  const toMax = (max: Date, { watchedAt }: WatchedMovie | WatchedShow) =>
    watchedAt > max ? watchedAt : max;

  return [...shows.values()].reduce(
    toMax,
    [...movies.values()].reduce(toMax, new Date(0)),
  );
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
  const moviesQuery = useInfiniteQuery(
    currentUserWatchedMoviesQuery({ limit: historyLimit }),
  );
  const showsQuery = useInfiniteQuery(
    currentUserWatchedShowsQuery({ limit: historyLimit }),
  );

  const history = combineLatest([moviesQuery, showsQuery]).pipe(
    tap(([movies, shows]) => {
      [movies, shows]
        .filter((q) => q.hasNextPage && !q.isFetchingNextPage)
        .forEach((q) => q.fetchNextPage());
    }),
    map(([movies, shows]) => {
      if (!isSettled(movies) || !isSettled(shows)) {
        return null;
      }

      const moviesMap = toQueryMap(movies);
      const showsMap = toQueryMap(shows);

      return {
        movies: moviesMap,
        shows: showsMap,
        lastWatchedAt: getLastWatchedAt(moviesMap, showsMap),
      };
    }),
    distinctUntilChanged((prev, curr) => prev === null && curr === null),
  );

  const isLoading = combineLatest([moviesQuery, showsQuery]).pipe(
    map(([movies, shows]) => !isSettled(movies) || !isSettled(shows)),
  );

  return { history, isLoading };
}
