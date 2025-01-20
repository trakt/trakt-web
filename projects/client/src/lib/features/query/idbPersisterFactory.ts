import { browser } from '$app/environment';
import { NOOP_FN } from '$lib/utils/constants';
import type {
  PersistedClient,
  Persister,
} from '@tanstack/svelte-query-persist-client';
import { del, get, set } from 'idb-keyval';

/**
 * Creates an Indexed DB persister
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export function idbPersisterFactory(
  idbValidKey: IDBValidKey = 'trakt-query-client',
): Persister {
  if (!browser) {
    return {
      persistClient: NOOP_FN,
      restoreClient: () => Promise.resolve(undefined),
      removeClient: NOOP_FN,
    };
  }

  const handleError = (error: unknown) => {
    console.error('IDB Persister Error:', error);
    return undefined;
  };

  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client)
        .catch(handleError);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey)
        .catch(handleError);
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  };
}
