import {
  InvalidateAction,
  type InvalidateActionOptions,
} from '$lib/requests/models/InvalidateAction.ts';
import { setMarker } from '$lib/utils/date/Marker.ts';
import type { QueryClient } from '@tanstack/query-core';

type InvalidateActionsParams = {
  client: QueryClient | Nil;
  actions: InvalidateActionOptions[];
};

export async function invalidateActions(
  { client, actions }: InvalidateActionsParams,
): Promise<void> {
  if (actions.length === 0) {
    return;
  }

  actions.forEach(setMarker);

  const hasAuth = actions.includes(InvalidateAction.Auth);

  if (hasAuth) {
    await client?.removeQueries();
  }

  await client?.invalidateQueries({
    predicate: (query) =>
      hasAuth || actions.some((action) => query.queryKey.includes(action)),
  });
}
