import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import type { CreateInfiniteQueryOptions } from '$lib/features/query/types.ts';
import type { InfiniteData, QueryKey } from '@tanstack/query-core';
import { firstValueFrom, map } from 'rxjs';

export function usePaginatedListQuery<
  TOutput extends { key: string },
  TError extends Error,
>(
  props: CreateInfiniteQueryOptions<
    Paginatable<TOutput>,
    TError,
    InfiniteData<Paginatable<TOutput>>,
    QueryKey,
    number
  >,
) {
  const query = useInfiniteQuery(props);

  const isLoading = query.pipe(
    map(($query) => toLoadingState($query) || $query.isFetchingNextPage),
  );

  const list = query.pipe(
    map(($query) => {
      if (!$query.data?.pages) {
        return [];
      }

      // Dedupe across pages to counter offset pagination drift
      return $query.data.pages
        .flatMap((page) => page.entries)
        .filter(
          ((seen) => (entry) => {
            if (seen.has(entry.key)) return false;
            seen.add(entry.key);
            return true;
          })(new Set<string>()),
        );
    }),
  );

  const hasNextPage = query.pipe(map(($query) => $query.hasNextPage));

  const fetchNextPage = async () => {
    const { fetchNextPage } = await firstValueFrom(query);
    await fetchNextPage();
  };

  return {
    list,
    isLoading,
    hasNextPage,
    fetchNextPage,
  };
}
