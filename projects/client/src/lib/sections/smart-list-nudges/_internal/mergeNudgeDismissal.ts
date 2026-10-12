import type { NudgeDismissalRecord } from './NudgeDismissalRecord.ts';

export function mergeNudgeDismissal(
  local: NudgeDismissalRecord,
  remote: NudgeDismissalRecord,
): NudgeDismissalRecord {
  return {
    dismissedAt: Math.max(local.dismissedAt, remote.dismissedAt),
    count: Math.max(local.count, remote.count),
  };
}
