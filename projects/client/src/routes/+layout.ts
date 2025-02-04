import type { LayoutLoad } from './$types.ts';

import { browser } from '$app/environment';
import { currentUserSettingsQuery } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import { QueryClient } from '@tanstack/svelte-query';

export const load: LayoutLoad = async ({ data, fetch }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        retry: 5,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
      },
    },
  });

  if (data.auth.isAuthorized) {
    await queryClient.prefetchQuery(currentUserSettingsQuery({ fetch }));
  }

  return { queryClient, ...data };
};
