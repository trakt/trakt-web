import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import {
  type CreateInfiniteQueryOptions,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/svelte-query';
import { map, shareReplay } from 'rxjs';

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
  const query$ = toObservable(query).pipe(shareReplay(1));

  const isLoading = query$.pipe(
    map((q) => toLoadingState(q) || q.isFetchingNextPage),
  );

  const list = query$.pipe(
    map((q) => {
      if (!q.data?.pages) {
        return [];
      }

      return q.data.pages.flatMap((page) => page.entries);
    }),
  );

  const hasNextPage = query$.pipe(
    map((q) => q.hasNextPage),
  );

  const fetchNextPage = query$.pipe(
    map((q) => () => q.fetchNextPage()),
  );

  return {
    list,
    isLoading,
    hasNextPage,
    fetchNextPage,
  };
}
