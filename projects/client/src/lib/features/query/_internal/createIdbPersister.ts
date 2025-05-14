import { error } from '$lib/utils/console/print.ts';
import { monitor } from '$lib/utils/perf/monitor.ts';
import type {
  PersistedClient,
  Persister,
} from '@tanstack/svelte-query-persist-client';
import { del, get, set } from 'idb-keyval';

const IDB_VALID_KEY = 'trakt-query-client';

/**
 * Creates an Indexed DB persister or a no-op persister based on environment
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export function createIdbPersister(): Persister {
  const handleError = (e: unknown) => {
    error('IDB Persister Error:', e);
    return undefined;
  };

  return {
    persistClient: monitor(async (client: PersistedClient) => {
      await set(IDB_VALID_KEY, client)
        .catch(handleError);
    }, 'IDB Persister'),
    restoreClient: monitor(async () => {
      return await get<PersistedClient>(IDB_VALID_KEY)
        .catch(handleError);
    }, 'IDB Restorer'),
    removeClient: async () => {
      await del(IDB_VALID_KEY);
    },
  };
}
