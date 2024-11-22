import type { LayoutLoad } from './$types';

import { browser } from '$app/environment';
import { setToken } from '$lib/features/auth/token/index.ts';
import { QueryClient } from '@tanstack/svelte-query';

export const load: LayoutLoad = ({ data }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        retry: 5,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });

  setToken(data.token);

  return { queryClient, ...data };
};
