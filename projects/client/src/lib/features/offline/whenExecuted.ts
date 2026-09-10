import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction.ts';
import type { ExecuteOrEnqueueOutcome } from './executeOrEnqueue.ts';

/**
 * Invalidations for a write that may have been queued instead of sent. A
 * queued action carries its own tokens and invalidates when it replays.
 */
export function whenExecuted(actions: InvalidateActionOptions[]) {
  return (
    { data }: { data: ExecuteOrEnqueueOutcome },
  ): InvalidateActionOptions[] => data === 'executed' ? actions : [];
}
