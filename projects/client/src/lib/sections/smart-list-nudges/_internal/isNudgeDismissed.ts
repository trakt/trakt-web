import { time } from '$lib/utils/timing/time.ts';
import type { NudgeDismissalRecord } from './NudgeDismissalRecord.ts';

const SNOOZE_MS = time.days(14);

type IsNudgeDismissedProps = {
  record: NudgeDismissalRecord | undefined;
  now: number;
  maxDismissals: number;
};

export function isNudgeDismissed(
  { record, now, maxDismissals }: IsNudgeDismissedProps,
): boolean {
  if (!record) {
    return false;
  }

  if (record.count >= maxDismissals) {
    return true;
  }

  return now - record.dismissedAt < SNOOZE_MS;
}
