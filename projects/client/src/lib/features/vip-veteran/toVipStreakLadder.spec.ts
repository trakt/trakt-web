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
      false,
    ]);
    expect(rungs.find((rung) => rung.isCurrent)?.tier).to.equal(7);
  });

  it('should point at the next rung', () => {
    expect(toVipStreakLadder(veteran(8, 7)).next).to.deep.equal({
      tier: 10,
      memberTier: 'legend',
      yearsLeft: 2,
    });
  });

  it('should point legends at Original', () => {
    expect(toVipStreakLadder(veteran(13, 10)).next).to.deep.equal({
      tier: 15,
      memberTier: 'original',
      yearsLeft: 2,
    });
  });

  it('should crown fifteen years as Original with no next rung', () => {
    const ladder = toVipStreakLadder(veteran(16, 10));

    expect(ladder.next).to.equal(null);
    expect(ladder.rungs.find((rung) => rung.isCurrent)?.memberTier).to.equal(
      'original',
    );
  });

  it('should give each rung its tier', () => {
    expect(
      toVipStreakLadder(veteran(1, 1)).rungs.map((rung) => rung.memberTier),
    ).to.deep.equal(['vip', 'pro', 'veteran', 'elite', 'legend', 'original']);
  });
});
