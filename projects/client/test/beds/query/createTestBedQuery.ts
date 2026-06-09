import { queryBridge } from '$lib/features/query/_internal/queryBridge.svelte.ts';
import {
  type CreateQueryOptions,
  useQueryClient,
} from '@tanstack/svelte-query';

export function createTestBedQuery<
  TQueryFnData = unknown,
  TError extends Error = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = [],
>(
  options: CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) {
  const client = useQueryClient();
  return queryBridge<TData, TError>(
    () => options as unknown as CreateQueryOptions<TData, TError>,
    client,
  );
}
