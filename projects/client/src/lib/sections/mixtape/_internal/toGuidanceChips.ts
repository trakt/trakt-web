const SEVERITY_RANK: Readonly<Record<string, number>> = {
  mild: 1,
  moderate: 2,
  severe: 3,
};

const rankOf = (tone: string) => SEVERITY_RANK[tone] ?? 0;

export function toGuidanceChips<T extends { severityTone: string }>(
  categories: ReadonlyArray<T>,
) {
  const flagged = categories
    .filter((category) => rankOf(category.severityTone) > 0)
    .toSorted((a, b) => rankOf(b.severityTone) - rankOf(a.severityTone));

  const isReported = categories.some(
    (category) => category.severityTone !== 'unknown',
  );

  return { flagged, isReported };
}
