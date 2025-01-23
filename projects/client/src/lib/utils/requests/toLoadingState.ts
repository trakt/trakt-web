import type { QueryObserverResult } from '@tanstack/svelte-query';

export function toLoadingState<T>(query: QueryObserverResult<T>) {
  return query.isPending || query.isFetching;
}
