import { describe, expect, it } from 'vitest';
import type { VipPlan } from '../models/VipPlan.ts';
import { findTwoYearDealPlan } from './findTwoYearDealPlan.ts';

const twoYears: VipPlan = {
  type: 'two_years',
  monthlyPrice: 4,
  totalPrice: 96,
  durationInMonths: 24,
  isPopular: false,
  discount: null,
};

const yearly: VipPlan = {
  type: 'yearly',
  monthlyPrice: 5,
  totalPrice: 60,
  durationInMonths: 12,
  isPopular: true,
  discount: null,
};

const dealDiscount = {
  discountedAmount: 60,
  discountedAmountMonthly: 2.5,
  firstTermOnly: true,
};

const liteDiscount = {
  discountedAmount: 95.76,
  discountedAmountMonthly: 3.99,
  firstTermOnly: false,
};

describe('util: findTwoYearDealPlan', () => {
  it('should return the 2 year plan when its discount is first term only', () => {
    const dealPlan = { ...twoYears, discount: dealDiscount };

    expect(findTwoYearDealPlan([dealPlan, yearly])).toEqual(dealPlan);
  });

  it('should ignore the always-on lite discount', () => {
    const litePlan = { ...twoYears, discount: liteDiscount };

    expect(findTwoYearDealPlan([litePlan, yearly])).toBeUndefined();
  });

  it('should ignore first term discounts on other plans', () => {
    const yearlyDeal = { ...yearly, discount: dealDiscount };

    expect(findTwoYearDealPlan([twoYears, yearlyDeal])).toBeUndefined();
  });

  it('should return undefined without any discount', () => {
    expect(findTwoYearDealPlan([twoYears, yearly])).toBeUndefined();
  });

  it('should return undefined for an empty list', () => {
    expect(findTwoYearDealPlan([])).toBeUndefined();
  });
});
