import { browser } from '$app/environment';
import { setToken } from '$lib/features/auth/token/index.ts';
import { retryDelay } from '$lib/utils/retry/retryDelay.ts';
import type { LayoutLoad } from '$types/$types.d.ts';
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

  const activeAuth = data.legacyAuth.isAuthorized ? data.legacyAuth : data.oidcAuth;
  setToken({ value: activeAuth.token, expiresAt: activeAuth.expiresAt });

  return { queryClient, ...data };
};
