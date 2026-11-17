import type { VipPlan, VipPlanDiscount } from '../models/VipPlan.ts';

export function isFirstTermDealPlan(
  plan: VipPlan,
): plan is VipPlan & { discount: VipPlanDiscount } {
  return plan.discount?.firstTermOnly === true;
}
