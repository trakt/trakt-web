import { browser } from '$app/environment';
import {
  InvalidateAction,
  type InvalidateActionOptions,
} from '$lib/requests/models/InvalidateAction.ts';
import { useQueryClient } from '@tanstack/svelte-query';

export function useInvalidator() {
  const client = browser ? useQueryClient() : undefined;

  const invalidate = async (action: InvalidateActionOptions) => {
    if (action === InvalidateAction.Auth) {
      await client?.removeQueries();
    }

    await client?.invalidateQueries({
      predicate: (query) => {
        return action === InvalidateAction.Auth ||
          query.queryKey.includes(action);
      },
    });
  };

  return {
    invalidate,
  };
}
