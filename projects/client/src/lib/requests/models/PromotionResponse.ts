import { z } from 'zod';
import { VipPlanDurationSchema } from './VipPlanDuration.ts';

const PromotionPlanResponseSchema = z.object({
  duration: VipPlanDurationSchema,
  currency: z.string(),
  amount: z.number(),
  amount_off: z.number(),
  discounted_amount: z.number(),
  months_in_term: z.number(),
  first_term_only: z.boolean(),
});

const PromotionResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  theme: z.string(),
  starts_at: z.string(),
  ends_at: z.string(),
  audience: z.string(),
  plan: PromotionPlanResponseSchema,
  app_countries: z.array(z.string()),
});

export const PromotionsResponseSchema = z.array(PromotionResponseSchema);

export type PromotionResponse = z.infer<typeof PromotionResponseSchema>;
