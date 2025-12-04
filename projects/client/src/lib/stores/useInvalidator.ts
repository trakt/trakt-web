import { browser } from '$app/environment';
import {
  InvalidateAction,
  type InvalidateActionOptions,
} from '$lib/requests/models/InvalidateAction.ts';
import { useQueryClient } from '@tanstack/svelte-query';
import { setMarker } from '../utils/date/Marker.ts';

export function useInvalidator() {
  const client = browser ? useQueryClient() : undefined;

  const invalidate = async (action: InvalidateActionOptions) => {
    setMarker(action);

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
