import { queryBridge } from '$lib/features/query/_internal/queryBridge.ts';
import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import type { CreateQueryOptions } from '$lib/features/query/types.ts';

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
