import type { BulkAddPick } from './BulkAddPick.ts';

export function toggleAllPicks(
  picks: ReadonlyArray<BulkAddPick>,
  candidates: ReadonlyArray<BulkAddPick>,
): BulkAddPick[] {
  const pickedKeys = new Set(picks.map(({ key }) => key));
  const isAllPicked = candidates.every(({ key }) => pickedKeys.has(key));

  if (isAllPicked) {
    const candidateKeys = new Set(candidates.map(({ key }) => key));
    return picks.filter(({ key }) => !candidateKeys.has(key));
  }

  return [
    ...picks,
    ...candidates.filter(({ key }) => !pickedKeys.has(key)),
  ];
}
