import { invalidateActions } from '$lib/features/query/invalidateActions.ts';
import { MutationCache } from '@tanstack/query-core';

export function createMutationCache(): MutationCache {
  return new MutationCache({
    onSuccess: (_data, _variables, _onMutateResult, mutation, context) =>
      invalidateActions({
        client: context.client,
        actions: mutation.options.meta?.invalidations ?? [],
      }),
  });
}
