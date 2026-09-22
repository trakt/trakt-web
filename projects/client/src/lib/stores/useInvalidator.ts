import { browser } from '$app/environment';
import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import { invalidateActions } from '$lib/features/query/invalidateActions.ts';
import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction.ts';
import type { InvalidateQueryFilters } from '@tanstack/query-core';

export function useInvalidator() {
  const client = browser ? useQueryClient() : undefined;

  const invalidateAll = (
    actions: InvalidateActionOptions[],
    options: Pick<InvalidateQueryFilters, 'refetchType'> = {},
  ) => invalidateActions({ client, actions, ...options });

  const invalidate = (action: InvalidateActionOptions) =>
    invalidateAll([action]);

  return {
    invalidate,
    invalidateAll,
  };
}
