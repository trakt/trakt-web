import type { MatchKind } from '$lib/requests/models/MatchKind.ts';

const LEVEL_CUTOFFS: Record<MatchKind, readonly [number, number, number]> = {
  match: [30, 70, 90],
  hype: [40, 70, 85],
};

export type MatchLevel = 0 | 1 | 2 | 3 | 4;

export function matchLevel(score: number | null, kind: MatchKind): MatchLevel {
  if (score === null) return 0;
  return (1 +
    LEVEL_CUTOFFS[kind].filter((cutoff) => score >= cutoff)
      .length) as MatchLevel;
}
