import { browser } from '$app/environment';
import { error } from '$lib/utils/console/print.ts';
import { NOOP_FN } from '$lib/utils/constants';
import { monitor } from '$lib/utils/perf/monitor';
import type {
  PersistedClient,
  Persister,
} from '@tanstack/svelte-query-persist-client';
import { del, get, set } from 'idb-keyval';

/**
 * Creates an Indexed DB persister
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export function createPersister(
  idbValidKey: IDBValidKey = 'trakt-query-client',
): Persister {
  if (!browser) {
    return {
      persistClient: NOOP_FN,
      restoreClient: () => Promise.resolve(undefined),
      removeClient: NOOP_FN,
    };
  }

  const handleError = (e: unknown) => {
    error('IDB Persister Error:', e);
    return undefined;
  };

  return {
    persistClient: monitor(async (client: PersistedClient) => {
      await set(idbValidKey, client)
        .catch(handleError);
    }, 'IDB Persister'),
    restoreClient: monitor(async () => {
      return await get<PersistedClient>(idbValidKey)
        .catch(handleError);
    }, 'IDB Restorer'),
    removeClient: async () => {
      await del(idbValidKey);
    },
  };
}
