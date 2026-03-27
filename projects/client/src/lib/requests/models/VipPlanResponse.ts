import { z } from 'zod';
import { VipPlanDurationSchema } from './VipPlanDuration.ts';

const VipPlanDiscountResponseSchema = z.object({
  coupon: z.string(),
  amount_off: z.number(),
  discounted_amount: z.number(),
  discounted_amount_monthly: z.number(),
  first_term_only: z.boolean(),
});

const VipPlanResponseSchema = z.object({
  plan_code: z.string(),
  duration: VipPlanDurationSchema,
  amount: z.number(),
  amount_monthly: z.number(),
  months_in_term: z.number(),
  discount: VipPlanDiscountResponseSchema.nullable(),
});

export const VipPlansResponseSchema = z.array(VipPlanResponseSchema);

export type VipPlanResponse = z.infer<typeof VipPlanResponseSchema>;
