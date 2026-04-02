export function computeRatingsDistribution(
  scores: ReadonlyArray<number>,
): { readonly buckets: readonly number[]; readonly average: number } {
  const valid = scores.filter((s) => s >= 1 && s <= 10);
  const buckets = Array.from(
    { length: 10 },
    (_, i) => valid.filter((s) => s === i + 1).length,
  );
  const average = valid.length > 0
    ? valid.reduce((sum, s) => sum + s, 0) / valid.length
    : 0;

  return { buckets, average };
}
