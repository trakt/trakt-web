import type { ClientState } from '$lib/requests/models/ClientState.ts';
import type { QueryObserverResult } from '@tanstack/query-core';

export function toSettledClientState(
  query: Pick<QueryObserverResult<ClientState | null>, 'data' | 'fetchStatus'>,
): ClientState | null | undefined {
  if (query.data !== undefined) return query.data;

  return query.fetchStatus === 'fetching' ? undefined : null;
}
