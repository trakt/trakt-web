import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { describe, expect, it } from 'vitest';
import { toVipTier } from './toVipTier.ts';

const streak = (tier: number): VipVeteran => ({
  since: new Date('2016-03-01T10:00:00.000Z'),
  years: tier,
  tier,
});

describe('util: toVipTier', () => {
  it('should mark members without VIP as free', () => {
    expect(toVipTier({ isVip: false })).to.equal('free');
  });

  it('should keep VIPs without a streak plain VIP', () => {
    expect(toVipTier({ isVip: true, veteran: null })).to.equal('vip');
  });

  it('should follow the streak ladder', () => {
    expect(toVipTier({ isVip: true, veteran: streak(3) })).to.equal('pro');
    expect(toVipTier({ isVip: true, veteran: streak(10) })).to.equal('legend');
  });

  it('should put directors above every streak', () => {
    expect(
      toVipTier({ isVip: true, isDirector: true, veteran: streak(10) }),
    ).to.equal('director');
    expect(toVipTier({ isVip: false, isDirector: true })).to.equal('director');
  });
});
