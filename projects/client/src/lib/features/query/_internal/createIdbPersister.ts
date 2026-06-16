import { error } from '$lib/utils/console/print.ts';
import { monitor } from '$lib/utils/perf/monitor.ts';
import { time } from '$lib/utils/timing/time.ts';
import {
  type AsyncStorage,
  experimental_createQueryPersister,
  type PersistedQuery,
} from '@tanstack/query-persist-client-core';
import { createStore, del, entries, get, set } from 'idb-keyval';

const DB_NAME = 'trakt-query';
const STORE_NAME = 'query-cache';
const MAX_AGE_MS = time.days(1);

// Bump on any change to the persisted format. Stale entries are evicted on
// read via the persister's buster check.
const BUSTER = 'v3';

const handleError = (e: unknown) => {
  error('IDB Persister Error:', e);
};

// Storage round-trips PersistedQuery through IDB structured clone, so Dates,
// Maps, Sets, and other built-ins survive rehydration. The default JSON
// serializer would coerce them to plain strings/objects and break consumers
// that depend on their prototypes.
function createIdbStorage(): AsyncStorage<PersistedQuery> {
  const store = createStore(DB_NAME, STORE_NAME);

  return {
    getItem: monitor(
      (key: string) =>
        get<PersistedQuery>(key, store).catch((e) => {
          handleError(e);
          return undefined;
        }),
      'IDB Restorer',
    ),
    setItem: monitor(
      (key: string, value: PersistedQuery) =>
        set(key, value, store).catch(handleError),
      'IDB Persister',
    ),
    removeItem: (key: string) => del(key, store).catch(handleError),
    entries: () =>
      entries<string, PersistedQuery>(store)
        .then((rows) =>
          rows.map(([k, v]) => [String(k), v] as [string, PersistedQuery])
        )
        .catch((e) => {
          handleError(e);
          return [];
        }),
  };
}

function isPersistedQuery(value: unknown): value is PersistedQuery {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as PersistedQuery).state === 'object' &&
    (value as PersistedQuery).state !== null
  );
}

// Default serializer is JSON. We pass identity because idb-keyval already
// round-trips through IDB structured clone, preserving Date/Map/Set prototypes.
// Validate shape on read so stale JSON-string entries from prior deploys throw
// inside the persister's deserialize-try block, which removes and skips them.
const serialize = (value: PersistedQuery): PersistedQuery => value;
const deserialize = (value: PersistedQuery): PersistedQuery => {
  if (!isPersistedQuery(value)) {
    throw new TypeError('Invalid persisted query shape');
  }
  return value;
};

/**
 * Per-query IDB persister via TanStack's experimental_createQueryPersister.
 * Each query writes to its own IDB key, so writes never serialize the whole
 * cache. Restore is lazy: a query is rehydrated only when its observer
 * subscribes.
 */
export function createIdbPersister() {
  return experimental_createQueryPersister<PersistedQuery>({
    storage: createIdbStorage(),
    serialize,
    deserialize,
    buster: BUSTER,
    maxAge: MAX_AGE_MS,
  });
}
