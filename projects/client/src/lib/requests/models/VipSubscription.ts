import { z } from 'zod';
import { VipGatewaySchema } from './VipGateway.ts';

const VipTypeSchema = z.enum(['monthly', 'yearly', 'two_years', 'life']);

export const VipSubscriptionSchema = z.object({
  type: VipTypeSchema,
  memberSince: z.date().nullable(),
  renewsAt: z.date().nullable(),
  expiresAt: z.date().nullable(),
  gateway: VipGatewaySchema.nullable(),
  isCancelled: z.boolean(),
});

export type VipSubscription = z.infer<
  typeof VipSubscriptionSchema
>;
