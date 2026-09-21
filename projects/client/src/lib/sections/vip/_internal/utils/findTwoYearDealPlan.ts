import type { VipDealPlan } from '../models/VipDealPlan.ts';
import type { VipPlan } from '../models/VipPlan.ts';
import { isTwoYearDealPlan } from './isTwoYearDealPlan.ts';

export function findTwoYearDealPlan(
  plans: ReadonlyArray<VipPlan>,
): VipDealPlan | undefined {
  return plans.find(isTwoYearDealPlan);
}
