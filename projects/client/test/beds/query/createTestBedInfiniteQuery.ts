import { infiniteQueryBridge } from '$lib/features/query/_internal/queryBridge.svelte.ts';
import {
  type CreateInfiniteQueryOptions,
  type InfiniteData,
  type QueryKey,
  useQueryClient,
} from '@tanstack/svelte-query';

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
