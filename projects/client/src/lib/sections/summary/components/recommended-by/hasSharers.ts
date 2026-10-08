import type { RecommendedBy } from '$lib/requests/models/RecommendedBy.ts';

export function hasSharers(
  recommendedBy: RecommendedBy | Nil,
): recommendedBy is RecommendedBy {
  if (recommendedBy == null) return false;

  return recommendedBy.users.length + recommendedBy.otherCount > 0;
}
