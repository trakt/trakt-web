import type { VipDealPlan } from '../models/VipDealPlan.ts';
import type { VipPlan } from '../models/VipPlan.ts';

// A first-term-only discount on the 2 year plan is a deal (former VIP rejoin
// or PayPal switch); the always-on v3 Lite discount is not first-term-only.
export function isTwoYearDealPlan(plan: VipPlan): plan is VipDealPlan {
  return plan.type === 'two_years' && plan.discount?.firstTermOnly === true;
}
