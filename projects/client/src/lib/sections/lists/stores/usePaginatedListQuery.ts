import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
import { rethrowUnlessCancelled } from '$lib/features/query/rethrowUnlessCancelled.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import { dedupe } from '$lib/utils/array/dedupe.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import type { CreateInfiniteQueryOptions } from '$lib/features/query/types.ts';
import type { InfiniteData, QueryKey } from '@tanstack/query-core';
import { distinctUntilChanged, firstValueFrom, map } from 'rxjs';

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
    map(($query) => $query.data),
    distinctUntilChanged(),
    map((data) => {
      if (!data?.pages) {
        return [];
      }

      // Dedupe across pages to counter offset pagination drift
      return dedupe(
        (entry) => entry.key,
        data.pages.flatMap((page) => page.entries),
      );
    }),
  );

  const hasNextPage = query.pipe(map(($query) => $query.hasNextPage));

  const fetchNextPage = async () => {
    const { fetchNextPage } = await firstValueFrom(query);
    await fetchNextPage({ cancelRefetch: false }).catch(rethrowUnlessCancelled);
  };

  return {
    list,
    isLoading,
    hasNextPage,
    fetchNextPage,
  };
}
