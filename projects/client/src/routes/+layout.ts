import { browser } from '$app/environment';
import { setToken } from '$lib/features/auth/token/index.ts';
import { createIdbPersister } from '$lib/features/query/_internal/createIdbPersister.ts';
import { retryDelay } from '$lib/utils/retry/retryDelay.ts';
import type { LayoutLoad } from '$types/$types.d.ts';
import { QueryClient } from '@tanstack/query-core';

const QUERY_CACHE_BUSTER = 'v2';

const persister = browser ? createIdbPersister(QUERY_CACHE_BUSTER) : undefined;

export const load: LayoutLoad = ({ data }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
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
