import type { VipPlan } from '../models/VipPlan.ts';

export const VIP_PLANS: VipPlan[] = [
  {
    type: 'two_years',
    monthlyPrice: 4,
    totalPrice: 96,
    durationInMonths: 24,
    isPopular: false,
    discount: null,
  },
  {
    type: 'yearly',
    monthlyPrice: 5,
    totalPrice: 60,
    durationInMonths: 12,
    isPopular: true,
    discount: null,
  },
  {
    type: 'monthly',
    monthlyPrice: 6,
    totalPrice: 6,
    durationInMonths: 1,
    isPopular: false,
    discount: null,
  },
];
