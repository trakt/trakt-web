import type { QueryObserverResult } from '@tanstack/query-core';

export function toLoadingState(query: QueryObserverResult) {
  return query.isEnabled && (query.isPending || query.isFetching);
}
