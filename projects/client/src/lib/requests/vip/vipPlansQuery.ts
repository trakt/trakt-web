import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import {
  type VipPlanResponse,
  VipPlansResponseSchema,
} from '$lib/requests/models/VipPlanResponse.ts';
import { defineQuery } from '../../features/query/defineQuery.ts';
import { time } from '../../utils/timing/time.ts';
import {
  type VipPlan,
  VipPlanSchema,
} from '../../sections/vip/_internal/models/VipPlan.ts';
import { z } from 'zod';

type VipPlansParams = ApiParams;

const PLAN_ORDER: ReadonlyArray<VipPlan['type']> = [
  'two_years',
  'yearly',
  'monthly',
];

function toPlans(
  response: ReadonlyArray<VipPlanResponse>,
): VipPlan[] {
  const plans = response.map((plan): VipPlan => ({
    type: plan.duration,
    monthlyPrice: plan.amount_monthly,
    totalPrice: plan.amount,
    durationInMonths: plan.months_in_term,
    isPopular: plan.duration === 'yearly',
    discount: plan.discount
      ? {
        discountedAmount: plan.discount.discounted_amount,
        discountedAmountMonthly: plan.discount.discounted_amount_monthly,
        firstTermOnly: plan.discount.first_term_only,
      }
      : null,
  }));

  return plans.toSorted((a, b) =>
    PLAN_ORDER.indexOf(a.type) - PLAN_ORDER.indexOf(b.type)
  );
}

const vipPlansRequest = async (
  { fetch }: VipPlansParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: '/vip/plans',
  });

  return response.ok
    ? {
      body: VipPlansResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: [] as VipPlanResponse[], status: 200 };
};

export const vipPlansQuery = defineQuery({
  key: 'vipPlans',
  invalidations: [],
  dependencies: [],
  request: vipPlansRequest,
  mapper: (response) => toPlans(response.body),
  schema: z.array(VipPlanSchema),
  ttl: time.hours(1),
});
