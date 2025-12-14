import { toObservable } from '$lib/utils/store/toObservable.ts';
import {
  createQuery,
  type CreateQueryOptions,
  type QueryObserverResult,
} from '@tanstack/svelte-query';

export function createTestBedQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = [],
>(
  options: CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) {
  return toObservable<QueryObserverResult<TData, TError>>(createQuery(options));
}
