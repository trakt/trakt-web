import { z } from 'zod';
import { VipPlanDurationSchema } from '$lib/requests/models/VipPlanDuration.ts';

export const VipPlanDiscountSchema = z.object({
  discountedAmount: z.number(),
  discountedAmountMonthly: z.number(),
  firstTermOnly: z.boolean(),
});

export type VipPlanDiscount = z.infer<typeof VipPlanDiscountSchema>;

export const VipPlanSchema = z.object({
  type: VipPlanDurationSchema,
  monthlyPrice: z.number(),
  totalPrice: z.number(),
  durationInMonths: z.number(),
  isPopular: z.boolean(),
  discount: VipPlanDiscountSchema.nullable(),
});

export type VipPlan = z.infer<typeof VipPlanSchema>;
