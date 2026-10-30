import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { describe, expect, it } from 'vitest';
import { toVipStreakLadder } from './toVipStreakLadder.ts';

const veteran = (years: number, title: VipVeteran['title']): VipVeteran => ({
  since: new Date('2016-03-01T10:00:00.000Z'),
  years,
  title,
});

describe('util: toVipStreakLadder', () => {
  it('should mark the reached rungs and the current one', () => {
    const { rungs } = toVipStreakLadder(veteran(8, 'elite'));

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
    expect(toVipStreakLadder(veteran(8, 'elite')).next).to.deep.equal({
      tier: 10,
      userTier: 'legend',
      yearsLeft: 2,
    });
  });

  it('should crown legends with no next rung', () => {
    const ladder = toVipStreakLadder(veteran(16, 'legend'));

    expect(ladder.next).to.equal(null);
    expect(ladder.rungs.find((rung) => rung.isCurrent)?.userTier).to.equal(
      'legend',
    );
  });

  it('should mark plain VIP current when the API sends no title', () => {
    const { rungs } = toVipStreakLadder(veteran(1, null));

    expect(rungs.find((rung) => rung.isCurrent)?.userTier).to.equal('vip');
  });

  it('should follow the API title, not the years', () => {
    const ladder = toVipStreakLadder(veteran(8, 'veteran'));

    expect(ladder.rungs.map((rung) => rung.isReached)).to.deep.equal([
      true,
      true,
      true,
      false,
      false,
    ]);
    expect(ladder.next?.userTier).to.equal('elite');
  });

  it('should give each rung its tier', () => {
    expect(
      toVipStreakLadder(veteran(1, null)).rungs.map((rung) => rung.userTier),
    ).to.deep.equal(['vip', 'pro', 'veteran', 'elite', 'legend']);
  });
});
