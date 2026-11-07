const LEVEL_CUTOFFS = [30, 70, 90] as const;

export type MatchLevel = 0 | 1 | 2 | 3 | 4;

export function matchLevel(score: number | null): MatchLevel {
  if (score === null) return 0;
  return (1 +
    LEVEL_CUTOFFS.filter((cutoff) => score >= cutoff).length) as MatchLevel;
}
