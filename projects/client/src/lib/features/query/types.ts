import type {
  DefaultError,
  InfiniteQueryObserverOptions,
  QueryKey,
  QueryObserverOptions,
} from '@tanstack/query-core';

/**
 * Local aliases for the QueryObserver option shapes. Plain re-exports of the
 * query-core option types, kept here so call sites stay agnostic of the
 * underlying TanStack package.
 */
export type CreateQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = QueryObserverOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryFnData,
  TQueryKey
>;

export type CreateInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
> = InfiniteQueryObserverOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey,
  TPageParam
>;
