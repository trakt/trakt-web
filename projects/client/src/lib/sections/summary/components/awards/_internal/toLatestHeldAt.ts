import type { AwardEntry } from '$lib/requests/models/AwardEntry.ts';

export function toLatestHeldAt(
  entries: ReadonlyArray<AwardEntry>,
): Date | undefined {
  return entries
    .map((entry) => entry.ceremony.heldAt)
    .filter((heldAt) => heldAt != null)
    .reduce<Date | undefined>(
      (latest, heldAt) => (latest && latest > heldAt ? latest : heldAt),
      undefined,
    );
}
