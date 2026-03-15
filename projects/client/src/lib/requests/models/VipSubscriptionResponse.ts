import { z } from 'zod';
import { VipGatewaySchema } from './VipGateway.ts';

const VipTypeSchema = z.enum(['monthly', 'yearly', 'two_years', 'life']);
const VipTransactionTypeSchema = z.enum([
  'create',
  'payment',
  'cancel',
  'refund',
  'dispute',
  'plan_change',
  'kaleforjustin',
]);

const VipRenewalSchema = z.object({
  date: z.string().datetime(),
  plan: z.string().nullable(),
  duration: VipTypeSchema.nullable(),
  price: z.object({
    usd: z.string().nullable(),
    readable: z.string(),
  }),
});

const VipTransactionSchema = z.object({
  id: z.number(),
  gateway: VipGatewaySchema,
  transaction_type: VipTransactionTypeSchema,
  created_at: z.string().datetime(),
  vip_type: VipTypeSchema.nullable(),
  vip_plan: z.string().nullable(),
  amount: z.string().nullable(),
  currency: z.string().nullable(),
  coupon_code: z.string().nullable(),
  trial_months: z.number().nullable(),
});

export const VipSubscriptionResponseSchema = z.object({
  vip: z.boolean(),
  vip_ep: z.boolean(),
  vip_og: z.boolean(),
  vip_years: z.number(),
  cancelled: z.boolean(),
  days_left: z.number(),
  transactions: z.array(VipTransactionSchema),
  vip_signed_up_at: z.string().datetime().nullable(),
  expires_at: z.string().datetime().nullable(),
  gateway: VipGatewaySchema.nullable(),
  type: VipTypeSchema.nullable(),
  plan: z.string().nullable(),
  renewal: VipRenewalSchema.optional(),
});

export type VipSubscriptionResponse = z.infer<
  typeof VipSubscriptionResponseSchema
>;
