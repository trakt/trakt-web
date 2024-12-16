import { browser } from '$app/environment';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useQueryClient } from '@tanstack/svelte-query';

export function useInvalidator() {
  const client = browser ? useQueryClient() : undefined;

  const invalidate = (action: InvalidateAction) => {
    client?.invalidateQueries({
      predicate: (query) => {
        return query.queryKey.includes(action);
      },
    });
  };

  return {
    invalidate,
  };
}
