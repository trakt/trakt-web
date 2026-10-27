import { describe, expect, it } from 'vitest';
import { toVipTitleTier } from './toVipTitleTier.ts';

describe('util: toVipTitleTier', () => {
  it('should keep untitled members plain VIP', () => {
    expect(toVipTitleTier(null)).to.equal('vip');
  });

  it('should use the rung that holds the title', () => {
    expect(toVipTitleTier('pro')).to.equal('pro');
    expect(toVipTitleTier('veteran')).to.equal('veteran');
    expect(toVipTitleTier('elite')).to.equal('elite');
    expect(toVipTitleTier('legend')).to.equal('legend');
  });
});
