import type { AwardCeremonyKey } from '$lib/requests/models/AwardCeremonyKey.ts';
import type { AwardBadge } from './models/AwardBadge.ts';
import type { AwardGroup } from './models/AwardGroup.ts';
import type { AwardTally } from './models/AwardTally.ts';
import { toAwardTally } from './toAwardTally.ts';

const WIN_PRIORITY: ReadonlyArray<AwardCeremonyKey> = [
  'oscars',
  'cannes',
  'venice',
  'berlin',
  'golden-globes',
  'emmys',
  'emmys-creative-arts',
  'other',
];

function findWinner(groups: ReadonlyArray<AwardGroup>) {
  return WIN_PRIORITY.map((key) => groups.find((group) => group.key === key))
    .filter((group) => group != null)
    .find((group) => group.wins > 0);
}

function toPendingTally(group: AwardGroup): AwardTally {
  return {
    id: group.id,
    ceremony: group.key,
    kind: 'nominations',
    wins: 0,
    nominations: group.entries.filter((entry) => entry.won === null).length,
  };
}

function toPick(groups: ReadonlyArray<AwardGroup>): AwardTally | undefined {
  const pending = groups.find((group) => group.phase === 'pre');
  if (pending) return toPendingTally(pending);

  const pick = findWinner(groups) ?? groups.at(0);
  return pick && toAwardTally(pick);
}

export function toAwardBadge(
  groups: ReadonlyArray<AwardGroup>,
): AwardBadge | null {
  const pick = toPick(groups);
  if (!pick) return null;

  return {
    ...pick,
    isLive: groups.some((group) => group.phase !== 'none'),
  };
}
