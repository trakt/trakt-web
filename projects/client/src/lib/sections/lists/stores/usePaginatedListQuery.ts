import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import {
  type CreateInfiniteQueryOptions,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/svelte-query';
import { derived, type Readable } from 'svelte/store';

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

  const isLoading = derived(
    query,
    ($query) => toLoadingState($query) || $query.isFetchingNextPage,
  );

  const list = derived(query, ($query) => {
    if (!$query.data?.pages) {
      return [];
    }

    return $query.data.pages.flatMap((page) => page.entries);
  });

  const hasNextPage = derived(query, ($query) => $query.hasNextPage);

  const fetchNextPage: Readable<() => Promise<void>> = derived(
    query,
    ($query) => () => $query.fetchNextPage(),
  );

  return {
    list,
    isLoading,
    hasNextPage,
    fetchNextPage,
  };
}
