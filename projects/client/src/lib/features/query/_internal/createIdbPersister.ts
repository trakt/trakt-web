import { error } from '$lib/utils/console/print.ts';
import { monitor } from '$lib/utils/perf/monitor.ts';
import { time } from '$lib/utils/timing/time.ts';
import {
  type AsyncStorage,
  experimental_createQueryPersister,
} from '@tanstack/query-persist-client-core';
import { createStore, del, entries, get, set } from 'idb-keyval';

const DB_NAME = 'trakt-query';
const STORE_NAME = 'query-cache';
const MAX_AGE_MS = time.days(1);

const handleError = (e: unknown) => {
  error('IDB Persister Error:', e);
};

function createIdbStorage(): AsyncStorage<string> {
  const store = createStore(DB_NAME, STORE_NAME);

  return {
    getItem: monitor(
      (key: string) =>
        get<string>(key, store).catch((e) => {
          handleError(e);
          return undefined;
        }),
      'IDB Restorer',
    ),
    setItem: monitor(
      (key: string, value: string) => set(key, value, store).catch(handleError),
      'IDB Persister',
    ),
    removeItem: (key: string) => del(key, store).catch(handleError),
    entries: () =>
      entries<string, string>(store)
        .then((rows) =>
          rows.map(([k, v]) => [String(k), v] as [string, string])
        )
        .catch((e) => {
          handleError(e);
          return [];
        }),
  };
}

/**
 * Per-query IDB persister via TanStack's experimental_createQueryPersister.
 * Each query writes to its own IDB key, so writes never serialize the whole
 * cache. Restore is lazy: a query is rehydrated only when its observer
 * subscribes.
 */
export function createIdbPersister(buster: string) {
  return experimental_createQueryPersister<string>({
    storage: createIdbStorage(),
    buster,
    maxAge: MAX_AGE_MS,
  });
}
