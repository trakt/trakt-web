import { browser } from '$app/environment';
import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import { invalidateActions } from '$lib/features/query/invalidateActions.ts';
import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction.ts';

export function useInvalidator() {
  const client = browser ? useQueryClient() : undefined;

  const invalidateAll = (actions: InvalidateActionOptions[]) =>
    invalidateActions({ client, actions });

  const invalidate = (action: InvalidateActionOptions) =>
    invalidateAll([action]);

  return {
    invalidate,
    invalidateAll,
  };
}
