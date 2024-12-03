import type { LayoutLoad } from './$types';

import { browser } from '$app/environment';
import { isAuthorized, setToken } from '$lib/features/auth/token/index.ts';
import { QueryClient } from '@tanstack/svelte-query';
import { currentUserSettingsQuery } from '../lib/features/auth/queries/currentUserSettingsQuery.ts';

export const load: LayoutLoad = async ({ data, fetch }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        retry: 0,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });

  setToken(data.token);

  if (isAuthorized()) {
    await queryClient.prefetchQuery(currentUserSettingsQuery({ fetch }));
  }

  return { queryClient, ...data };
};
