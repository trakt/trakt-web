import type { AwardGroup } from './models/AwardGroup.ts';
import type { AwardTally } from './models/AwardTally.ts';
import { toAwardTally } from './toAwardTally.ts';

export function toAwardSummary(
  groups: ReadonlyArray<AwardGroup>,
): AwardTally[] {
  return groups.map(toAwardTally);
}
