import { toObservable } from '$lib/utils/store/toObservable.ts';
import {
  createInfiniteQuery,
  type CreateInfiniteQueryOptions,
  type InfiniteQueryObserverResult,
} from '@tanstack/svelte-query';

export function createTestBedInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = [],
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
  return toObservable<InfiniteQueryObserverResult<TData, TError>>(
    createInfiniteQuery(options),
  );
}
