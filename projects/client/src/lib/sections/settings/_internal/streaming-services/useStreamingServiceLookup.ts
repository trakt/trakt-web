import { useQuery } from '$lib/features/query/useQuery.ts';
import type { StreamingConnection } from '$lib/requests/models/StreamingConnection.ts';
import { streamingConnectionsQuery } from '$lib/requests/queries/streaming-sync/streamingConnectionsQuery.ts';
import { map } from 'rxjs';

/**
 * Exposes a reactive map from streaming service id to its connection, so
 * tables that only carry a service id (data syncs, sync items) can render the
 * matching logo / name.
 */
export function useStreamingServiceLookup() {
  const lookup = useQuery(streamingConnectionsQuery()).pipe(
    map((query) => {
      const entries = new Map<string, StreamingConnection>();
      (query.data ?? []).forEach((connection) =>
        entries.set(connection.id, connection)
      );
      return entries;
    }),
  );

  return { lookup };
}
