import { z } from 'zod';

export const VipCancelReasonSchema = z.enum([
  'price',
  'usage',
  'feature',
  'broken',
  'switch',
  'break',
]);

export type VipCancelReason = z.infer<typeof VipCancelReasonSchema>;
