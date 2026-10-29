import { describe, expect, it } from 'vitest';
import { toVipLadderTier } from './toVipLadderTier.ts';

describe('util: toVipLadderTier', () => {
  it('should keep the first years plain VIP', () => {
    expect(toVipLadderTier(1)).to.equal('vip');
  });

  it('should climb one tier every rung', () => {
    expect(toVipLadderTier(3)).to.equal('pro');
    expect(toVipLadderTier(5)).to.equal('veteran');
    expect(toVipLadderTier(7)).to.equal('elite');
    expect(toVipLadderTier(10)).to.equal('legend');
  });

  it('should stay on the last rung reached', () => {
    expect(toVipLadderTier(6)).to.equal('veteran');
    expect(toVipLadderTier(14)).to.equal('legend');
  });
});
