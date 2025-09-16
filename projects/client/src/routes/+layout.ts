import type { LayoutLoad } from './$types.ts';

import { browser } from '$app/environment';
import { currentUserSettingsQuery } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import { setToken } from '$lib/features/auth/token/index.ts';
import { retryDelay } from '$lib/utils/queries/retryDelay.ts';
import { QueryClient } from '@tanstack/svelte-query';

function isExpired(expiresAt: number | Nil): boolean {
  return expiresAt ? new Date(expiresAt).getTime() < Date.now() : true;
}

export const load: LayoutLoad = async ({ data, fetch }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        retry: 5,
        retryDelay,
        refetchOnWindowFocus: false,
      },
    },
  });

  const auth = data.auth.isAuthorized ? data.auth : data.oidcAuth;
  setToken({ value: auth.token, expiresAt: auth.expiresAt });

  const canPrefetch = data.auth.isAuthorized || !isExpired(auth.expiresAt);
  if (canPrefetch) {
    await queryClient.prefetchQuery(currentUserSettingsQuery({ fetch }));
  }

  return { queryClient, ...data };
};
