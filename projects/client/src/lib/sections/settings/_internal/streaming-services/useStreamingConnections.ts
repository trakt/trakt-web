import { useQuery } from '$lib/features/query/useQuery.ts';
import { streamingConnectionsQuery } from '$lib/requests/queries/streaming-sync/streamingConnectionsQuery.ts';
import { map } from 'rxjs';

/**
 * Splits the user's streaming connections into services they can act on
 * (already connected, or connectable on their current plan - e.g. HBO Max for
 * free users) and VIP-gated services they cannot connect yet. Both views share
 * one cached query so the split stays consistent across sections.
 */
export function useStreamingConnections() {
  const connections = useQuery(streamingConnectionsQuery()).pipe(
    map((query) => query.data ?? []),
  );

  const available = connections.pipe(
    map((list) =>
      list.filter(
        (connection) => connection.isConnected || connection.isConnectable,
      )
    ),
  );

  const locked = connections.pipe(
    map((list) =>
      list.filter(
        (connection) => !connection.isConnected && !connection.isConnectable,
      )
    ),
  );

  return { available, locked };
}
