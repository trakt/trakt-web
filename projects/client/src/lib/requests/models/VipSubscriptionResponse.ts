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

const responseGateWaySchema = z.enum([...VipGatewaySchema.options, '']);

// The API serializes monetary values inconsistently - renewal `usd` comes
// back as a number while transaction `amount` is a string. Accept either so a
// numeric price doesn't fail the whole `/vip/details` parse.
const MoneySchema = z.union([z.string(), z.number()]).nullable();

const VipRenewalSchema = z.object({
  date: z.string().datetime(),
  plan: z.string().nullable(),
  duration: VipTypeSchema.nullable(),
  price: z.object({
    usd: MoneySchema,
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
  amount: MoneySchema,
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
  gateway: responseGateWaySchema.nullable(),
  type: VipTypeSchema.nullable(),
  plan: z.string().nullable(),
  renewal: VipRenewalSchema.optional(),
  manage_url: z.string().nullish(),
});

export type VipSubscriptionResponse = z.infer<
  typeof VipSubscriptionResponseSchema
>;
