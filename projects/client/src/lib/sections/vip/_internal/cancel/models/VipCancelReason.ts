import { z } from 'zod';

export const VipCancelReasonSchema = z.enum([
  'price',
  'usage',
  'feature',
  'broken',
  'switch',
  'break',
  'other',
]);

export type VipCancelReason = z.infer<typeof VipCancelReasonSchema>;
