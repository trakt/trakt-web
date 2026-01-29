import type { VipPlan } from './models/VipPlan.ts';

export const VIP_PLANS: VipPlan[] = [
  {
    type: 'two_years',
    monthlyPrice: 4,
    duration: 24,
  },
  {
    type: 'yearly',
    monthlyPrice: 5,
    duration: 12,
  },
  {
    type: 'monthly',
    monthlyPrice: 6,
    duration: 1,
  },
] as const;
