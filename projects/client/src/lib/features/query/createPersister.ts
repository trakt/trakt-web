import { browser } from '$app/environment';
import { NOOP_FN } from '$lib/utils/constants';
import { monitor } from '$lib/utils/perf/monitor';

import type {
  PersistedClient,
  Persister,
} from '@tanstack/svelte-query-persist-client';
import { Serializer } from './Serializer';

export function createLocalStoragePersister(
  key = 'trakt-query-client',
): Persister {
  if (!browser) {
    return {
      persistClient: NOOP_FN,
      restoreClient: () => Promise.resolve(undefined),
      removeClient: NOOP_FN,
    };
  }

  return {
    persistClient: (client: PersistedClient) => {
      localStorage.setItem(key, Serializer.encode(client));
      return Promise.resolve();
    },
    restoreClient: monitor(() => {
      try {
        const client = localStorage.getItem(key);
        return Promise.resolve(client ? Serializer.decode(client) : undefined);
      } catch {
        return Promise.resolve(undefined);
      }
    }, 'Client Restore'),
    removeClient: () => {
      localStorage.removeItem(key);
      return Promise.resolve();
    },
  };
}

export function createPersister() {
  return createLocalStoragePersister();
}
