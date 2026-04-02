import type { PulseStat } from './models/PulseStat.ts';

const scoreWeights = {
  delta: 4,
  richness: 3,
  info: 3,
} as const;

function deltaScore(delta: number | null, numValue: number): number {
  if (delta == null) return 3;
  const absDelta = Math.abs(delta);
  if (absDelta === 0) return 0;
  return Math.max(Math.min((absDelta / Math.max(numValue, 1)) * 10, 10), 2);
}

function richnessScore(numValue: number, delta: number | null): number {
  if (numValue > 0) return Math.min(numValue, 10);
  if (delta != null && delta !== 0) return 2;
  return 0;
}

function infoScore(
  numValue: number,
  delta: number | null,
  note?: string,
): number {
  if (numValue === 0 && (delta ?? 0) === 0) return 0;
  return note ? 7 : 5;
}

// (10 * 4) + (10 * 3) + (7 * 3) = 130
export const statScoreMax = 130;

function scoreStat(stat: PulseStat): number {
  return (
    deltaScore(stat.delta, stat.rawValue) * scoreWeights.delta +
    richnessScore(stat.rawValue, stat.delta) * scoreWeights.richness +
    infoScore(stat.rawValue, stat.delta, stat.note) * scoreWeights.info
  );
}

const redundancyPenalty = 0.01;

function isRedundant(
  stat: PulseStat,
  rawCounts: ReadonlyMap<string, number>,
): boolean {
  const plays = rawCounts.get('totalPlays') ?? 0;
  const episodes = rawCounts.get('episodes') ?? 0;
  const movies = rawCounts.get('movies') ?? 0;

  return (
    (stat.key === 'totalPlays' && plays > 0 &&
      (plays === episodes || plays === movies)) ||
    (stat.key === 'movies' && movies === 0 && stat.delta === 0) ||
    (stat.key === 'episodes' && episodes === 0 && stat.delta === 0)
  );
}

export function scoreStatWithContext(
  stat: PulseStat,
  rawCounts: ReadonlyMap<string, number>,
): number {
  const base = scoreStat(stat);
  return isRedundant(stat, rawCounts) ? base * redundancyPenalty : base;
}

export function rankStats(
  candidates: ReadonlyArray<PulseStat>,
  rawCounts: ReadonlyMap<string, number>,
): readonly PulseStat[] {
  return [...candidates].sort(
    (a, b) =>
      scoreStatWithContext(b, rawCounts) - scoreStatWithContext(a, rawCounts),
  );
}
