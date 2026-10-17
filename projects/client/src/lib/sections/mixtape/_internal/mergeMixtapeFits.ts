import { dedupe } from '$lib/utils/array/dedupe.ts';

type Fit = { id: number; score: number };

export function mergeMixtapeFits(
  local: ReadonlyArray<Fit>,
  deep: ReadonlyArray<Fit>,
): Fit[] {
  return dedupe(
    ({ id }) => id,
    deep.map(({ id, score }) => ({ id, score })),
    [...local],
  ).sort((a, b) => b.score - a.score);
}
