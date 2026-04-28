import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
import {
  showActivityHistoryQuery,
} from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { map, tap } from 'rxjs';

type UseShowWatchedEpisodesProps = {
  showId: number;
};

export function useShowWatchedEpisodes(
  { showId }: UseShowWatchedEpisodesProps,
) {
  const query = useInfiniteQuery(
    showActivityHistoryQuery({ slug: 'me', id: showId, limit: 100 }),
  );

  const watchedBySeason = query.pipe(
    tap(($query) => {
      if ($query.hasNextPage && !$query.isFetchingNextPage) {
        $query.fetchNextPage();
      }
    }),
    map(($query) => {
      const entries = $query.data?.pages.flatMap((page) => page.entries) ?? [];

      return entries.reduce((acc, entry) => {
        const { season, number } = entry.episode;
        const existing = acc.get(season) ?? new Set<number>();

        return acc.set(season, existing.add(number));
      }, new Map<number, Set<number>>());
    }),
  );

  const isLoading = query.pipe(
    map(($query) => $query.isPending || $query.isFetchingNextPage),
  );

  return { watchedBySeason, isLoading };
}
