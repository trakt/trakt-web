import type { QueryObserverResult } from '@tanstack/query-core';

type LoadableDataParams<T> = {
  isAuthorized: boolean;
  query: QueryObserverResult<T | Nil>;
};

export function toLoadableData<T>({
  isAuthorized,
  query,
}: LoadableDataParams<T>): T | null | undefined {
  if (!isAuthorized) {
    return null;
  }

  if (query.isLoading) {
    return undefined;
  }

  return query.data ?? null;
}
