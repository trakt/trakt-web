import type { RecommendedBy } from '$lib/requests/models/RecommendedBy.ts';
import { hasSharers } from '../recommended-by/hasSharers.ts';

type SharedPillStateParams = {
  activityCount: number;
  recommendedBy: RecommendedBy | null;
};

export function toSharedPillState(
  { activityCount, recommendedBy }: SharedPillStateParams,
) {
  const isShared = hasSharers(recommendedBy);

  return {
    isShared,
    isSharedOnly: isShared && activityCount === 0,
  };
}
