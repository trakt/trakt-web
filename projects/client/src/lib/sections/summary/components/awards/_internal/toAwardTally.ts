import type { AwardGroup } from './models/AwardGroup.ts';
import type { AwardTally } from './models/AwardTally.ts';

function toKind(group: AwardGroup): AwardTally['kind'] {
  if (group.wins === 0) return 'nominations';
  return group.isFestival ? 'festival' : 'wins';
}

export function toAwardTally(group: AwardGroup): AwardTally {
  return {
    id: group.id,
    ceremony: group.key,
    kind: toKind(group),
    wins: group.wins,
    nominations: group.nominations,
  };
}
