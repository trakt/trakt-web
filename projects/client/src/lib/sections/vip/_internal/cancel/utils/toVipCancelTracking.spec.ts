import { describe, expect, it } from 'vitest';
import { toVipCancelTracking } from './toVipCancelTracking.ts';

const offer = {
  source: 'retention' as const,
  discountedAmount: 60,
  totalPrice: 96,
  monthlyAmount: 2.5,
};

describe('util: toVipCancelTracking', () => {
  it('should tag the reason, tenure bucket and offer', () => {
    expect(
      toVipCancelTracking({
        reason: 'price',
        details: 'ignored',
        vipMonths: 30,
        offer,
      }),
    ).toEqual({ reason: 'price', tenure: '2y_plus', offer: 'retention_60' });
  });

  it('should send cleaned details for detailed reasons only', () => {
    expect(
      toVipCancelTracking({
        reason: 'other',
        details: 'mail me at jane@example.com',
        vipMonths: 0,
        offer: null,
      }),
    ).toEqual({
      reason: 'other',
      tenure: 'under_1m',
      offer: 'none',
      details: 'mail me at [removed]',
    });
  });

  it('should leave out empty details', () => {
    expect(
      toVipCancelTracking({
        reason: 'feature',
        details: '   ',
        vipMonths: 14,
        offer: null,
      }),
    ).not.toHaveProperty('details');
  });
});
