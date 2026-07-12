import type { OfflineAction } from './models/OfflineAction.ts';
import type { OfflineActionDomain } from './models/OfflineActionEndpoint.ts';

type FindPendingOverrideParams = {
  actions: OfflineAction[];
  domain: OfflineActionDomain;
  keys: string[];
};

/**
 * Queued action overriding server state for the given keys - the queue is
 * FIFO, so the last covering action reflects the user's latest intent.
 */
export function findPendingOverride(
  { actions, domain, keys }: FindPendingOverrideParams,
): OfflineAction | null {
  if (keys.length === 0) {
    return null;
  }

  const covers = (action: OfflineAction) =>
    action.endpoint.startsWith(`${domain}:`) &&
    keys.every((key) => action.keys.includes(key));

  return actions.filter(covers).at(-1) ?? null;
}
