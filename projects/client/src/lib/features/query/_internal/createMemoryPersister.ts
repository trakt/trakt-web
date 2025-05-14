import type {
  PersistedClient,
  Persister,
} from '@tanstack/svelte-query-persist-client';
import { monitor } from '../../../utils/perf/monitor.ts';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const getApproximateSize = (obj: unknown): number => {
  const jsonString = JSON.stringify(obj);
  return new TextEncoder().encode(jsonString).length;
};

/**
 * Creates an in-memory persister with a MAX_SIZE_BYTES limit
 */
export function createMemoryPersister(): Persister {
  const storage: {
    memory?: PersistedClient;
  } = { memory: undefined };

  function saveClient(
    client: PersistedClient,
  ): Promise<void> {
    storage.memory = client;
    return Promise.resolve();
  }

  function removeClient(): Promise<void> {
    storage.memory = undefined;
    return Promise.resolve();
  }

  function restoreClient(): Promise<PersistedClient | undefined> {
    return Promise.resolve(storage.memory);
  }

  return {
    persistClient: monitor((client: PersistedClient) => {
      const queries = [...Object.entries(client.clientState.queries)];
      let totalSize = getApproximateSize(client);

      const oldestQueries = queries.toSorted((a, b) =>
        a[1].state.dataUpdatedAt - b[1].state.dataUpdatedAt
      );

      // Remove oldest queries until we're under limit
      while (totalSize > MAX_SIZE_BYTES && queries.length > 0) {
        const [oldestKey] = oldestQueries.shift() || [];

        if (oldestKey == null) break;

        const oldestQuery = client.clientState
          .queries[oldestKey as keyof typeof client.clientState.queries];

        if (oldestQuery == null) break;

        const querySize = getApproximateSize(oldestQuery);

        delete client.clientState
          // skipcq: JS-0320
          .queries[oldestKey as keyof typeof client.clientState.queries];

        totalSize -= querySize;
      }

      return saveClient(client);
    }, 'Memory Persister'),

    restoreClient,

    removeClient,
  };
}
