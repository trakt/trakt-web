import { describe, expect, it } from 'vitest';
import type { VipPlan } from '../models/VipPlan.ts';
import { isTwoYearDealPlan } from './isTwoYearDealPlan.ts';

const twoYears: VipPlan = {
  type: 'two_years',
  monthlyPrice: 4,
  totalPrice: 96,
  durationInMonths: 24,
  isPopular: false,
  discount: null,
};

const dealDiscount = {
  discountedAmount: 60,
  discountedAmountMonthly: 2.5,
  firstTermOnly: true,
};

describe('util: isTwoYearDealPlan', () => {
  it('should accept a first term only discount on the 2 year plan', () => {
    expect(isTwoYearDealPlan({ ...twoYears, discount: dealDiscount })).toBe(
      true,
    );
  });

  it('should reject the always-on lite discount', () => {
    const lite = { ...dealDiscount, firstTermOnly: false };

    expect(isTwoYearDealPlan({ ...twoYears, discount: lite })).toBe(false);
  });

  it('should reject a first term only discount on another plan', () => {
    const yearly: VipPlan = {
      ...twoYears,
      type: 'yearly',
      totalPrice: 60,
      durationInMonths: 12,
      discount: dealDiscount,
    };

    expect(isTwoYearDealPlan(yearly)).toBe(false);
  });

  it('should reject a plan without a discount', () => {
    expect(isTwoYearDealPlan(twoYears)).toBe(false);
  });
});
