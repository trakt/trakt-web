import { map, type Observable } from 'rxjs';
import { findPendingOverride } from './findPendingOverride.ts';
import type { OfflineActionDomain } from './models/OfflineActionEndpoint.ts';
import { useOfflineActions } from './useOfflineActions.ts';

type UseIsQueuedParams = {
  domain: OfflineActionDomain;
  keys: string[];
};

/**
 * True while a queued (not-yet-synced) offline action covers these media
 * keys - lets the UI flag the action as pending rather than just disabled.
 */
export function useIsQueued(
  { domain, keys }: UseIsQueuedParams,
): { isQueued: Observable<boolean> } {
  const { actions } = useOfflineActions();

  const isQueued = actions.pipe(
    map((queued) =>
      findPendingOverride({ actions: queued, domain, keys }) != null
    ),
  );

  return { isQueued };
}
