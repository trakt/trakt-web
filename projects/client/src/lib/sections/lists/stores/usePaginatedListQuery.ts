import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import {
  type CreateInfiniteQueryOptions,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/svelte-query';
import { firstValueFrom, map } from 'rxjs';

export function usePaginatedListQuery<
  TOutput,
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

      return $query.data.pages.flatMap((page) => page.entries);
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
