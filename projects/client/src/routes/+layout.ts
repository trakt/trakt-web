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
        retry: 3,
        retryDelay,
        refetchOnWindowFocus: false,
      },
    },
  });

  setToken({ value: data.oidcAuth.token, expiresAt: data.oidcAuth.expiresAt });

  return { queryClient, ...data };
};
