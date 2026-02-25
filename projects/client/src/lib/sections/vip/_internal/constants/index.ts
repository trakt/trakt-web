import type { VipPlan } from '../models/VipPlan.ts';

export const VIP_PLANS: VipPlan[] = [
  {
    type: 'two_years',
    monthlyPrice: 4,
    durationInMonths: 24,
    isPopular: false,
  },
  {
    type: 'yearly',
    monthlyPrice: 5,
    durationInMonths: 12,
    isPopular: true,
  },
  {
    type: 'monthly',
    monthlyPrice: 6,
    durationInMonths: 1,
    isPopular: false,
  },
] as const;
