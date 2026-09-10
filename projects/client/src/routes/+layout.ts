import { browser } from '$app/environment';
import { setToken } from '$lib/features/auth/token/index.ts';
import { createIdbPersister } from '$lib/features/query/_internal/createIdbPersister.ts';
import { createMutationCache } from '$lib/features/query/createMutationCache.ts';
import { retryDelay } from '$lib/utils/retry/retryDelay.ts';
import type { LayoutLoad } from '$types/$types.d.ts';
import { QueryClient } from '@tanstack/query-core';

// IDB and structuredClone are missing on some restricted engines (PS4,
// in-app WebViews); guard before touching idb-keyval so query init doesn't
// crash. The query client falls back to an in-memory cache when unset.
const canPersist = browser &&
  typeof indexedDB !== 'undefined' &&
  typeof structuredClone !== 'undefined';
const persister = canPersist ? createIdbPersister() : undefined;

export const load: LayoutLoad = ({ data }) => {
  const queryClient = new QueryClient({
    mutationCache: createMutationCache(),
    defaultOptions: {
      mutations: {
        // query-core pauses an offline mutation instead of rejecting it.
        // Queueing is the offline feature's job, so writes stay eager.
        networkMode: 'always',
      },
      queries: {
        enabled: browser,
        retry: 3,
        retryDelay,
        refetchOnWindowFocus: false,
        persister: persister?.persisterFn,
      },
    },
  });

  // Best-effort sweep of expired entries. Runs once per cold layout load.
  persister?.persisterGc();

  setToken({ value: data.oidcAuth.token, expiresAt: data.oidcAuth.expiresAt });

  return { queryClient, ...data };
};
