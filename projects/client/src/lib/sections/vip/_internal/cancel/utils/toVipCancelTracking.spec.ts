import { describe, expect, it } from 'vitest';
import { toVipCancelTracking } from './toVipCancelTracking.ts';

const offer = {
  source: 'retention' as const,
  discountedAmount: 1008,
  totalPrice: 1337,
  monthlyAmount: 42,
};

describe('util: toVipCancelTracking', () => {
  it('should tag the reason, tenure bucket and offer', () => {
    expect(
      toVipCancelTracking({
        reason: 'price',
        vipMonths: 30,
        offer,
        gateway: 'stripe',
      }),
    ).toEqual({
      reason: 'price',
      tenure: '2y_plus',
      offer: 'retention_1008',
      gateway: 'stripe',
    });
  });

  it('should fall back when nothing is picked', () => {
    expect(
      toVipCancelTracking({
        reason: null,
        vipMonths: 0,
        offer: null,
        gateway: null,
      }),
    ).toEqual({
      reason: 'none',
      tenure: 'under_1m',
      offer: 'none',
      gateway: 'unknown',
    });
  });
});
