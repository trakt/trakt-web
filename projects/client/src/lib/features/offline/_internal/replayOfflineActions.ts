import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction.ts';
import type { OfflineAction } from '../models/OfflineAction.ts';
import { executeOfflineAction } from './executeOfflineAction.ts';
import { fetchFreshWatchedState } from './fetchFreshWatchedState.ts';
import { findDuplicateWatch } from './findDuplicateWatch.ts';
import type { FreshWatchedState } from './FreshWatchedState.ts';
import { isNetworkError } from './isNetworkError.ts';

export type ReplayOutcome = {
  executedIds: string[];
  failedIds: string[];
  duplicates: OfflineAction[];
  invalidations: InvalidateActionOptions[];
  aborted: boolean;
};

type ReplayOfflineActionsParams = {
  actions: OfflineAction[];
  reconcile?: boolean;
  execute?: (action: OfflineAction) => Promise<boolean>;
  fetchWatched?: () => Promise<FreshWatchedState>;
};

const ABORTED_OUTCOME: ReplayOutcome = {
  executedIds: [],
  failedIds: [],
  duplicates: [],
  invalidations: [],
  aborted: true,
};

async function resolveWatchedState(
  fetchWatched: () => Promise<FreshWatchedState>,
): Promise<FreshWatchedState | null | 'unreachable'> {
  try {
    return await fetchWatched();
  } catch (candidate) {
    if (isNetworkError(candidate)) {
      return 'unreachable';
    }

    // Fresh state is unavailable for a non-network reason. Worst case of
    // replaying without it is an extra play, which the user accepted.
    return null;
  }
}

/**
 * Replays queued actions in FIFO order. Watches already recorded elsewhere
 * after queuing come back as `duplicates` for the user to confirm; a network
 * failure aborts (rest stays queued), a server rejection drops the action.
 */
export async function replayOfflineActions({
  actions,
  reconcile = true,
  execute = executeOfflineAction,
  fetchWatched = fetchFreshWatchedState,
}: ReplayOfflineActionsParams): Promise<ReplayOutcome> {
  const needsReconcile = reconcile &&
    actions.some((action) => action.endpoint === 'history:add');

  const watched = needsReconcile
    ? await resolveWatchedState(fetchWatched)
    : null;

  if (watched === 'unreachable') {
    return ABORTED_OUTCOME;
  }

  const duplicates = watched === null
    ? []
    : actions.filter((action) => findDuplicateWatch({ action, watched }));
  const duplicateIds = new Set(duplicates.map(({ id }) => id));

  const executedIds: string[] = [];
  const failedIds: string[] = [];
  const invalidations = new Set<InvalidateActionOptions>();

  for (const action of actions) {
    if (duplicateIds.has(action.id)) {
      continue;
    }

    try {
      const isExecuted = await execute(action);

      if (!isExecuted) {
        failedIds.push(action.id);
        continue;
      }

      executedIds.push(action.id);
      action.invalidations.forEach((invalidation) =>
        invalidations.add(invalidation)
      );
    } catch (candidate) {
      if (isNetworkError(candidate)) {
        return {
          executedIds,
          failedIds,
          duplicates,
          invalidations: [...invalidations],
          aborted: true,
        };
      }

      // Unexpected error: drop the action so it cannot poison future replays.
      failedIds.push(action.id);
    }
  }

  return {
    executedIds,
    failedIds,
    duplicates,
    invalidations: [...invalidations],
    aborted: false,
  };
}
