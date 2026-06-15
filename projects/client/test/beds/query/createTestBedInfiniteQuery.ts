import { infiniteQueryBridge } from '$lib/features/query/_internal/queryBridge.ts';
import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import type { CreateInfiniteQueryOptions } from '$lib/features/query/types.ts';
import type { InfiniteData, QueryKey } from '@tanstack/query-core';

export function createTestBedInfiniteQuery<
  TQueryFnData = unknown,
  TError extends Error = Error,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  options: CreateInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
) {
  const client = useQueryClient();
  return infiniteQueryBridge<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >(
    () => options,
    client,
  );
}
