export function normalizeScore(
  raw: number,
  maxPossible: number,
): number {
  if (maxPossible <= 0) return 0;
  return Math.min((raw / maxPossible) * 100, 100);
}
