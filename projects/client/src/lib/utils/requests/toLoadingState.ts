import type { QueryObserverResult } from '@tanstack/svelte-query';

export function toLoadingState(query: QueryObserverResult) {
  return query.isEnabled && (query.isPending || query.isFetching);
}
