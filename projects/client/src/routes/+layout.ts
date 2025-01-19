import type { LayoutLoad } from './$types';

import { browser } from '$app/environment';
import { currentUserSettingsQuery } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import { watchNowSourcesQuery } from '$lib/requests/queries/watchnow/watchNowSourcesQuery';
import { QueryClient } from '@tanstack/svelte-query';

export const load: LayoutLoad = async ({ data, fetch }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        retry: 0,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
      },
    },
  });

  if (data.auth.isAuthorized) {
    await queryClient.prefetchQuery(currentUserSettingsQuery({ fetch }));
    await queryClient.prefetchQuery(watchNowSourcesQuery({ fetch }));
  }

  return { queryClient, ...data };
};
