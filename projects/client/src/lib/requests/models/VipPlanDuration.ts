import z from 'zod';

export const VipPlanDurationSchema = z.enum([
  'monthly',
  'yearly',
  'two_years',
]);

export type VipPlanDuration = z.infer<typeof VipPlanDurationSchema>;
