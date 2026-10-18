const MAX_CHECKED_TITLES = 100;

type ListOverlapProps = {
  count: number;
  confidence: number;
};

export type ListOverlap = {
  kept: number;
  total: number;
};

export function toListOverlap({
  count,
  confidence,
}: ListOverlapProps): ListOverlap | null {
  const total = Math.min(count, MAX_CHECKED_TITLES);

  if (total <= 0) {
    return null;
  }

  const kept = Math.round(Math.min(Math.max(confidence, 0), 1) * total);

  return { kept, total };
}
