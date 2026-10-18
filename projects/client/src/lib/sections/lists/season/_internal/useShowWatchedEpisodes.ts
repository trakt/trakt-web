import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useAllPagesInfiniteQuery } from '$lib/features/query/useQuery.ts';
import { showActivityHistoryQuery } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { map, of, switchMap } from 'rxjs';

type UseShowWatchedEpisodesProps = {
  showId: number;
};

type WatchedBySeason = Map<number, Set<number>>;

export function useShowWatchedEpisodes({
  showId,
}: UseShowWatchedEpisodesProps) {
  const { isAuthorized } = useAuth();

  const query = useAllPagesInfiniteQuery(
    showActivityHistoryQuery({ slug: 'me', id: showId, limit: 100 }),
  );

  const watchedBySeason = isAuthorized.pipe(
    switchMap((authorized) => {
      if (!authorized) return of<WatchedBySeason>(new Map());

      return query.pipe(
        map(($query) => {
          const entries =
            $query.data?.pages.flatMap((page) => page.entries) ?? [];

          return entries.reduce((acc, entry) => {
            const { season, number } = entry.episode;
            const existing = acc.get(season) ?? new Set<number>();

            return acc.set(season, existing.add(number));
          }, new Map() as WatchedBySeason);
        }),
      );
    }),
  );

  const isLoading = isAuthorized.pipe(
    switchMap((authorized) => {
      if (!authorized) return of(false);

      return query.pipe(
        map(($query) => $query.isPending || $query.isFetchingNextPage),
      );
    }),
  );

  return { watchedBySeason, isLoading };
}
