import type {
  PersistedClient,
  Persister,
} from '@tanstack/svelte-query-persist-client';
import { monitor } from '../../../utils/perf/monitor.ts';

/**
 * Creates an in-memory persister without size limits
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
      return saveClient(client);
    }, 'Memory Persister'),

    restoreClient,

    removeClient,
  };
}
