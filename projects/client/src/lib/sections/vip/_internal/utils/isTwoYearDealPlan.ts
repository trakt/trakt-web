import type { VipDealPlan } from '../models/VipDealPlan.ts';
import type { VipPlan } from '../models/VipPlan.ts';
import { isFirstTermDealPlan } from './isFirstTermDealPlan.ts';

// A first-term-only discount on the 2 year plan is a deal (PayPal switch);
// the always-on v3 Lite discount is not first-term-only.
export function isTwoYearDealPlan(plan: VipPlan): plan is VipDealPlan {
  return plan.type === 'two_years' && isFirstTermDealPlan(plan);
}
