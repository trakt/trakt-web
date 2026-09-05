import type { UserLimits } from '$lib/requests/models/UserLimits.ts';
import type { VipPlan } from '../models/VipPlan.ts';

export const VIP_PLANS: VipPlan[] = [
  {
    type: 'two_years',
    monthlyPrice: 4,
    totalPrice: 96,
    durationInMonths: 24,
    isPopular: false,
    discount: {
      discountedAmount: 95.76,
      discountedAmountMonthly: 3.99,
      firstTermOnly: false,
    },
  },
  {
    type: 'yearly',
    monthlyPrice: 5,
    totalPrice: 60,
    durationInMonths: 12,
    isPopular: true,
    discount: {
      discountedAmount: 59.88,
      discountedAmountMonthly: 4.99,
      firstTermOnly: false,
    },
  },
  {
    type: 'monthly',
    monthlyPrice: 6,
    totalPrice: 6,
    durationInMonths: 1,
    isPopular: false,
    discount: {
      discountedAmount: 5.99,
      discountedAmountMonthly: 5.99,
      firstTermOnly: false,
    },
  },
];

const emptyLimit = {
  current: 0,
  free: 0,
  vip: 0,
};

export const USER_LIMITS_PLACEHOLDER: UserLimits = {
  history: emptyLimit,
  ratings: emptyLimit,
  watchlistItems: emptyLimit,
  totalListItems: emptyLimit,
  staticLists: emptyLimit,
  dynamicLists: emptyLimit,
  digitalLibrary: emptyLimit,
  totalNotes: emptyLimit,
  connectedApps: emptyLimit,
};
