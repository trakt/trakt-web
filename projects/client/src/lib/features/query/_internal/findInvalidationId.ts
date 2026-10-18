import { invalidationId } from '$lib/requests/models/InvalidateAction.ts';

export function findInvalidationId(queryKey: readonly unknown[]): string | Nil {
  return queryKey.find(
    (key) => typeof key === 'string' && key.includes(invalidationId('')),
  ) as string | Nil;
}
