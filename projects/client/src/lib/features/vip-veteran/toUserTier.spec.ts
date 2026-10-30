import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { describe, expect, it } from 'vitest';
import { toUserTier } from './toUserTier.ts';

const streak = (title: VipVeteran['title'], years = 1): VipVeteran => ({
  since: new Date('2010-03-01T10:00:00.000Z'),
  years,
  title,
});

describe('util: toUserTier', () => {
  it('should mark members without VIP as free', () => {
    expect(toUserTier({ isVip: false })).to.equal('free');
    expect(toUserTier(null)).to.equal('free');
  });

  it('should keep VIPs without a streak or title plain VIP', () => {
    expect(toUserTier({ isVip: true, veteran: null })).to.equal('vip');
    expect(toUserTier({ isVip: true, veteran: streak(null) })).to.equal('vip');
  });

  it('should read the tier from the API title', () => {
    expect(toUserTier({ isVip: true, veteran: streak('pro') })).to.equal('pro');
    expect(toUserTier({ isVip: true, veteran: streak('elite') })).to.equal(
      'elite',
    );
    expect(toUserTier({ isVip: true, veteran: streak('legend') })).to.equal(
      'legend',
    );
  });

  it('should not recompute the tier from the years', () => {
    expect(
      toUserTier({ isVip: true, veteran: streak('veteran', 20) }),
    ).to.equal('veteran');
  });

  it('should rank directors by their streak like everyone else', () => {
    expect(
      toUserTier({ isVip: true, isDirector: true, veteran: streak('elite') }),
    ).to.equal('elite');
    expect(toUserTier({ isVip: true, isDirector: true })).to.equal('vip');
  });
});
