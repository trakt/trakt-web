import { retryDelay } from '$lib/utils/retry/retryDelay.ts';
import type { Handle } from '@sveltejs/kit';
import { QueryClient } from '@tanstack/svelte-query';

export const handle: Handle = async ({ event, resolve }) => {
  if (!event.locals.queryClient) {
    event.locals.queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          enabled: true,
          retry: 5,
          retryDelay,
          refetchOnWindowFocus: false,
        },
      },
    });
  }

  return await resolve(event);
};
