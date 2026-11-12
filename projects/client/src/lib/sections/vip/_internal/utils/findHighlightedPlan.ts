import type { VipPlanDuration } from '$lib/requests/models/VipPlanDuration.ts';
import type { VipPlan } from '../models/VipPlan.ts';

type FindHighlightedPlanParams = {
  plans: ReadonlyArray<VipPlan>;
  hasDealCard: boolean;
  requestedPlan?: VipPlanDuration | null;
};

export function findHighlightedPlan({
  plans,
  hasDealCard,
  requestedPlan,
}: FindHighlightedPlanParams): VipPlan | undefined {
  if (hasDealCard) return undefined;

  return (
    plans.find(({ type }) => type === requestedPlan) ??
    plans.find(({ isPopular }) => isPopular) ??
    plans.find(({ type }) => type === 'two_years')
  );
}
