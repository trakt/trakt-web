import { useQuery } from '$lib/features/query/useQuery.ts';
import { streamingConnectionsQuery } from '$lib/requests/queries/streaming-sync/streamingConnectionsQuery.ts';
import { map } from 'rxjs';

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
