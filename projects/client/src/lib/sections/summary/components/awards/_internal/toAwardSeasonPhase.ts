import type { AwardEntry } from '$lib/requests/models/AwardEntry.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { AwardSeasonPhase } from './models/AwardSeasonPhase.ts';
import { toLatestHeldAt } from './toLatestHeldAt.ts';

type ToAwardSeasonPhaseProps = {
  entries: ReadonlyArray<AwardEntry>;
  today: Date;
};

const LIVE_WINDOW = time.days(14);

export function toAwardSeasonPhase({
  entries,
  today,
}: ToAwardSeasonPhaseProps): AwardSeasonPhase {
  if (entries.some((entry) => entry.won === null)) return 'pre';

  const heldAt = toLatestHeldAt(entries);
  if (heldAt == null) return 'none';

  const elapsed = today.getTime() - heldAt.getTime();
  return elapsed >= 0 && elapsed <= LIVE_WINDOW ? 'post' : 'none';
}
