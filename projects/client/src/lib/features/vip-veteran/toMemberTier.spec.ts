import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { describe, expect, it } from 'vitest';
import { toMemberTier } from './toMemberTier.ts';

const streak = (tier: number, years = tier): VipVeteran => ({
  since: new Date('2010-03-01T10:00:00.000Z'),
  years,
  tier,
  title: null,
});

describe('util: toMemberTier', () => {
  it('should mark members without VIP as free', () => {
    expect(toMemberTier({ isVip: false })).to.equal('free');
    expect(toMemberTier(null)).to.equal('free');
  });

  it('should keep VIPs without a streak plain VIP', () => {
    expect(toMemberTier({ isVip: true, veteran: null })).to.equal('vip');
  });

  it('should climb one tier every rung', () => {
    expect(toMemberTier({ isVip: true, veteran: streak(3) })).to.equal('pro');
    expect(toMemberTier({ isVip: true, veteran: streak(5) })).to.equal(
      'veteran',
    );
    expect(toMemberTier({ isVip: true, veteran: streak(7) })).to.equal('elite');
    expect(toMemberTier({ isVip: true, veteran: streak(10) })).to.equal(
      'legend',
    );
  });

  it('should reach Original on the years past the top API tier', () => {
    expect(toMemberTier({ isVip: true, veteran: streak(10, 14) })).to.equal(
      'legend',
    );
    expect(toMemberTier({ isVip: true, veteran: streak(10, 15) })).to.equal(
      'original',
    );
    expect(toMemberTier({ isVip: true, veteran: streak(7, 16) })).to.equal(
      'elite',
    );
  });

  it('should put directors above every streak', () => {
    expect(
      toMemberTier({ isVip: true, isDirector: true, veteran: streak(10, 20) }),
    ).to.equal('director');
    expect(toMemberTier({ isVip: false, isDirector: true })).to.equal(
      'director',
    );
  });
});
