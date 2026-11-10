import type { AwardCeremonyKey } from '$lib/requests/models/AwardCeremonyKey.ts';
import type { AwardEntry } from '$lib/requests/models/AwardEntry.ts';
import type { AwardGroup } from './models/AwardGroup.ts';
import { toAwardSeasonPhase } from './toAwardSeasonPhase.ts';
import { toLatestHeldAt } from './toLatestHeldAt.ts';

type ToAwardGroupsProps = {
  entries: ReadonlyArray<AwardEntry>;
  today: Date;
};

const CEREMONY_ORDER: ReadonlyArray<AwardCeremonyKey> = [
  'oscars',
  'golden-globes',
  'emmys',
  'emmys-creative-arts',
  'cannes',
  'venice',
  'berlin',
  'other',
];

const FESTIVALS: ReadonlySet<AwardCeremonyKey> = new Set([
  'cannes',
  'venice',
  'berlin',
]);

function toGroup({
  id,
  key,
  entries,
  today,
}: ToAwardGroupsProps & { id: string; key: AwardCeremonyKey }): AwardGroup {
  return {
    id,
    key,
    name: entries.at(0)?.ceremony.name ?? '',
    isFestival: FESTIVALS.has(key),
    entries,
    wins: entries.filter((entry) => entry.won === true).length,
    nominations: entries.length,
    years: [...new Set(entries.map((entry) => entry.year))].sort(
      (a, b) => b - a,
    ),
    heldAt: toLatestHeldAt(entries),
    phase: toAwardSeasonPhase({ entries, today }),
  };
}

export function toAwardGroups({
  entries,
  today,
}: ToAwardGroupsProps): AwardGroup[] {
  return CEREMONY_ORDER.flatMap((key) => {
    const ceremonyEntries = entries.filter(
      (entry) => entry.ceremony.key === key,
    );
    const ids =
      key === 'other'
        ? [...new Set(ceremonyEntries.map((entry) => entry.ceremony.slug))]
        : [key];

    return ids.map((id) =>
      toGroup({
        id,
        key,
        entries: ceremonyEntries.filter(
          (entry) => key !== 'other' || entry.ceremony.slug === id,
        ),
        today,
      }),
    );
  }).filter((group) => group.nominations > 0);
}
