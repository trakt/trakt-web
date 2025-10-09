import { browser } from '$app/environment';
import { setToken } from '$lib/features/auth/token/index.ts';
import { retryDelay } from '$lib/utils/retry/retryDelay.ts';
import { hydrate, QueryClient } from '@tanstack/svelte-query';
import type { LayoutLoad } from '../../.svelte-kit/types/src/routes/$types.d.ts';

function isExpired(expiresAt: number | Nil): boolean {
  return expiresAt ? new Date(expiresAt).getTime() < Date.now() : true;
}

export const load: LayoutLoad = async ({ data }) => {
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
  hydrate(queryClient, data.dehydratedQueryClient);

  console.log(
    'LAYOUT LOAD',
    queryClient.getQueryCache().getAll(),
  );

  const auth = data.auth.isAuthorized ? data.auth : data.oidcAuth;
  setToken({ value: auth.token, expiresAt: auth.expiresAt });

  // const canPrefetch = data.auth.isAuthorized || !isExpired(auth.expiresAt);
  // if (canPrefetch) {
  // await queryClient.prefetchQuery(currentUserSettingsQuery({ fetch }));
  // }

  return { queryClient, ...data };
};
