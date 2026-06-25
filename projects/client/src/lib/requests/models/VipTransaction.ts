import { z } from 'zod';
import { VipGatewaySchema } from './VipGateway.ts';

const VipTransactionTypeSchema = z.enum([
  'create',
  'payment',
  'cancel',
  'refund',
  'dispute',
  'plan_change',
  'kaleforjustin',
]);

const VipTransactionVipTypeSchema = z.enum([
  'monthly',
  'yearly',
  'two_years',
  'life',
]);

export const VipTransactionSchema = z.object({
  id: z.number(),
  gateway: VipGatewaySchema,
  type: VipTransactionTypeSchema,
  vipType: VipTransactionVipTypeSchema.nullable(),
  amount: z.union([z.string(), z.number()]).nullable(),
  currency: z.string().nullable(),
  couponCode: z.string().nullable(),
  createdAt: z.date(),
});

export type VipTransaction = z.infer<typeof VipTransactionSchema>;
