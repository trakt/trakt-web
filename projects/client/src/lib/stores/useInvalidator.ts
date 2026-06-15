import { browser } from '$app/environment';
import {
  InvalidateAction,
  type InvalidateActionOptions,
} from '$lib/requests/models/InvalidateAction.ts';
import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import { setMarker } from '../utils/date/Marker.ts';

export function useInvalidator() {
  const client = browser ? useQueryClient() : undefined;

  const invalidateAll = async (actions: InvalidateActionOptions[]) => {
    actions.forEach(setMarker);

    const hasAuth = actions.includes(InvalidateAction.Auth);

    if (hasAuth) {
      await client?.removeQueries();
    }

    await client?.invalidateQueries({
      predicate: (query) => {
        return hasAuth ||
          actions.some((action) => query.queryKey.includes(action));
      },
    });
  };

  const invalidate = (action: InvalidateActionOptions) =>
    invalidateAll([action]);

  return {
    invalidate,
    invalidateAll,
  };
}
