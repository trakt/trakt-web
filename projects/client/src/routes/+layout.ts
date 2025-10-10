import type { LayoutLoad } from './$types.ts';

import { browser } from '$app/environment';
import { setToken } from '$lib/features/auth/token/index.ts';
import { retryDelay } from '$lib/utils/retry/retryDelay.ts';
import { QueryClient } from '@tanstack/svelte-query';

export const load: LayoutLoad = ({ data }) => {
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

  return { queryClient, ...data };
};
