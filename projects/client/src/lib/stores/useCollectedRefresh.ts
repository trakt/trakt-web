import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import type { InvalidateQueryFilters } from '@tanstack/query-core';
import { defer, type Observable } from 'rxjs';

export function useCollectedRefresh(
  options: Pick<InvalidateQueryFilters, 'refetchType'> = {},
): Observable<void> {
  const { invalidateAll } = useInvalidator();

  return defer(() =>
    invalidateAll([
      InvalidateAction.Collected('movie'),
      InvalidateAction.Collected('episode'),
    ], options)
  ).pipe(multicast());
}
