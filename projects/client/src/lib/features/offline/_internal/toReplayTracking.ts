import type { OfflineAction } from '../models/OfflineAction.ts';
import type { ReplayOutcome } from './replayOfflineActions.ts';

type ReplayTracking = {
  type: OfflineAction['endpoint'];
  outcome: 'done' | 'failed';
};

type ToReplayTrackingParams = {
  actions: ReadonlyArray<OfflineAction>;
  outcome: Pick<ReplayOutcome, 'executedIds' | 'failedIds'>;
};

export function toReplayTracking({
  actions,
  outcome,
}: ToReplayTrackingParams): ReadonlyArray<ReplayTracking> {
  const executed = new Set(outcome.executedIds);
  const failed = new Set(outcome.failedIds);

  return actions.flatMap(({ id, endpoint }): ReplayTracking[] => {
    if (executed.has(id)) {
      return [{ type: endpoint, outcome: 'done' }];
    }

    if (failed.has(id)) {
      return [{ type: endpoint, outcome: 'failed' }];
    }

    return [];
  });
}
