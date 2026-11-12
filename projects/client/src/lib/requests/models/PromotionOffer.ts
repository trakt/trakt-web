import { z } from 'zod';
import { VipPlanDurationSchema } from './VipPlanDuration.ts';

export const PromotionOfferSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  theme: z.string(),
  startsAt: z.date(),
  endsAt: z.date(),
  plan: z.object({
    duration: VipPlanDurationSchema,
    currency: z.string(),
    fullPrice: z.number(),
    discountedPrice: z.number(),
    amountOff: z.number(),
    monthsInTerm: z.number(),
    firstTermOnly: z.boolean(),
  }),
});

export type PromotionOffer = z.infer<typeof PromotionOfferSchema>;
