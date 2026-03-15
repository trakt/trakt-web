import { z } from 'zod';

export const VipGatewaySchema = z.enum([
  'stripe',
  'paypal',
  'paypal_api',
  'apple',
  'google',
]);

export type VipGateway = z.infer<typeof VipGatewaySchema>;
