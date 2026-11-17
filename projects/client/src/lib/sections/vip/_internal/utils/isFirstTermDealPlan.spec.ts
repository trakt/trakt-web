import { describe, expect, it } from 'vitest';
import type { VipPlan } from '../models/VipPlan.ts';
import { isFirstTermDealPlan } from './isFirstTermDealPlan.ts';

const monthly: VipPlan = {
  type: 'monthly',
  monthlyPrice: 5,
  totalPrice: 5,
  durationInMonths: 1,
  isPopular: false,
  discount: null,
};

const dealDiscount = {
  discountedAmount: 1,
  discountedAmountMonthly: 1,
  firstTermOnly: true,
};

describe('util: isFirstTermDealPlan', () => {
  it('should accept a first term only discount on any plan', () => {
    expect(isFirstTermDealPlan({ ...monthly, discount: dealDiscount })).toBe(
      true,
    );
  });

  it('should reject the always-on lite discount', () => {
    const lite = { ...dealDiscount, firstTermOnly: false };

    expect(isFirstTermDealPlan({ ...monthly, discount: lite })).toBe(false);
  });

  it('should reject a plan without a discount', () => {
    expect(isFirstTermDealPlan(monthly)).toBe(false);
  });
});
