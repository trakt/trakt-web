import { z } from 'zod';
import { VipGatewaySchema } from './VipGateway.ts';
import { VipTransactionSchema } from './VipTransaction.ts';

const VipTypeSchema = z.enum(['monthly', 'yearly', 'two_years', 'life']);

const VipRenewalPriceSchema = z.object({
  usd: z.union([z.string(), z.number()]).nullable(),
  readable: z.string(),
});

export const VipSubscriptionSchema = z.object({
  type: VipTypeSchema,
  plan: z.string().nullable(),
  memberSince: z.date().nullable(),
  renewsAt: z.date().nullable(),
  expiresAt: z.date().nullable(),
  gateway: VipGatewaySchema.nullable(),
  isCancelled: z.boolean(),
  vipYears: z.number(),
  daysLeft: z.number(),
  renewalPrice: VipRenewalPriceSchema.nullable(),
  manageUrl: z.string().nullable(),
  transactions: z.array(VipTransactionSchema),
});

export type VipSubscription = z.infer<
  typeof VipSubscriptionSchema
>;
