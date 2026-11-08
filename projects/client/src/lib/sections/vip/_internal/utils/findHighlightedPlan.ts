import type { VipPlan } from '../models/VipPlan.ts';

type FindHighlightedPlanParams = {
  plans: ReadonlyArray<VipPlan>;
  hasDealCard: boolean;
};

export function findHighlightedPlan({
  plans,
  hasDealCard,
}: FindHighlightedPlanParams): VipPlan | undefined {
  if (hasDealCard) return undefined;

  return (
    plans.find(({ isPopular }) => isPopular) ??
    plans.find(({ type }) => type === 'two_years')
  );
}
