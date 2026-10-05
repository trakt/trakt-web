import type { BulkAddPick } from './BulkAddPick.ts';

export function togglePick(
  picks: ReadonlyArray<BulkAddPick>,
  pick: BulkAddPick,
): BulkAddPick[] {
  return picks.some(({ key }) => key === pick.key)
    ? picks.filter(({ key }) => key !== pick.key)
    : [...picks, pick];
}
