import type { VipPlan, VipPlanDiscount } from './VipPlan.ts';

export type VipDealPlan = VipPlan & {
  type: 'two_years';
  discount: VipPlanDiscount;
};
