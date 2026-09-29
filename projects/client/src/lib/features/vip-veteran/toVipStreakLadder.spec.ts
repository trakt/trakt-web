import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { describe, expect, it } from 'vitest';
import { toVipStreakLadder } from './toVipStreakLadder.ts';

const veteran = (years: number, tier: number): VipVeteran => ({
  since: new Date('2016-03-01T10:00:00.000Z'),
  years,
  tier,
  title: null,
});

describe('util: toVipStreakLadder', () => {
  it('should mark the reached rungs and the current one', () => {
    const { rungs } = toVipStreakLadder(veteran(8, 7));

    expect(rungs.map((rung) => rung.isReached)).to.deep.equal([
      true,
      true,
      true,
      true,
      false,
    ]);
    expect(rungs.find((rung) => rung.isCurrent)?.tier).to.equal(7);
  });

  it('should point at the next rung', () => {
    expect(toVipStreakLadder(veteran(8, 7)).next).to.deep.equal({
      tier: 10,
      title: 'legend',
      yearsLeft: 2,
    });
  });

  it('should have no next rung for legends', () => {
    expect(toVipStreakLadder(veteran(13, 10)).next).to.equal(null);
  });

  it('should colour each rung by its tier', () => {
    expect(toVipStreakLadder(veteran(1, 1)).rungs.map((rung) => rung.tone))
      .to.deep.equal(['vip', 'deep', 'copper', 'silver', 'gold']);
  });
});
