import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction.ts';
import { executeOfflineAction } from './_internal/executeOfflineAction.ts';
import { isNetworkError } from './_internal/isNetworkError.ts';
import { offlineActionsStore } from './_internal/offlineActionsStore.ts';
import { onlineStatusStore } from './_internal/onlineStatusStore.ts';
import type { OfflineAction } from './models/OfflineAction.ts';
import type { OfflineActionBody } from './models/OfflineActionBody.ts';
import type { OfflineActionEndpoint } from './models/OfflineActionEndpoint.ts';

type ExecuteOrEnqueueParams<TEndpoint extends OfflineActionEndpoint> = {
  endpoint: TEndpoint;
  keys: string[];
  body: OfflineActionBody[TEndpoint];
  invalidations: InvalidateActionOptions[];
};

/**
 * Runs a tracking mutation right away when online, queues it otherwise.
 * Queued actions are replayed by `OfflineSync` once connectivity returns.
 */
export async function executeOrEnqueue<
  TEndpoint extends OfflineActionEndpoint,
>(
  { endpoint, keys, body, invalidations }: ExecuteOrEnqueueParams<TEndpoint>,
): Promise<'executed' | 'queued'> {
  const action: OfflineAction = {
    id: crypto.randomUUID(),
    endpoint,
    keys,
    body,
    invalidations,
    queuedAt: Date.now(),
  };

  if (!onlineStatusStore.isOnline()) {
    await offlineActionsStore.enqueue(action);
    return 'queued';
  }

  try {
    await executeOfflineAction(action);
    return 'executed';
  } catch (candidate) {
    if (!isNetworkError(candidate)) {
      throw candidate;
    }

    await offlineActionsStore.enqueue(action);
    return 'queued';
  }
}
