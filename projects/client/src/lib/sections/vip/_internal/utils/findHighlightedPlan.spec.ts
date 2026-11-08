import { describe, expect, it } from 'vitest';
import type { VipPlan } from '../models/VipPlan.ts';
import { findHighlightedPlan } from './findHighlightedPlan.ts';

const toPlan = (overrides: Partial<VipPlan>): VipPlan => ({
  type: 'monthly',
  monthlyPrice: 6,
  totalPrice: 6,
  durationInMonths: 1,
  isPopular: false,
  discount: null,
  ...overrides,
});

const monthly = toPlan({});
const yearly = toPlan({ type: 'yearly', isPopular: true });
const twoYears = toPlan({ type: 'two_years' });

describe('util: findHighlightedPlan', () => {
  it('should pick the popular plan', () => {
    expect(
      findHighlightedPlan({
        plans: [twoYears, yearly, monthly],
        hasDealCard: false,
      }),
    ).toBe(yearly);
  });

  it('should fall back to the best value plan when none is popular', () => {
    expect(
      findHighlightedPlan({
        plans: [twoYears, monthly],
        hasDealCard: false,
      }),
    ).toBe(twoYears);
  });

  it('should highlight nothing when the deal card is the hero', () => {
    expect(
      findHighlightedPlan({
        plans: [twoYears, yearly, monthly],
        hasDealCard: true,
      }),
    ).toBeUndefined();
  });

  it('should highlight nothing without a popular or best value plan', () => {
    expect(
      findHighlightedPlan({ plans: [monthly], hasDealCard: false }),
    ).toBeUndefined();
  });
});
