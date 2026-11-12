import { UserLimitsMappedMock } from '$mocks/data/vip/mapped/UserLimitsMappedMock.ts';
import type { Nudge, NudgeLimit } from '$lib/requests/models/Nudge.ts';
import { describe, expect, it } from 'vitest';
import { toNudgeCard } from './toNudgeCard.ts';

const limits = {
  ...UserLimitsMappedMock,
  watchlistItems: { current: 1, free: 1000, vip: 5000 },
  totalListItems: { current: 1, free: 1000, vip: 100000 },
  staticLists: { current: 1, free: 5, vip: 50 },
  totalNotes: { current: 1, free: 100, vip: 1000 },
};

const limitNudge = (
  used: number,
  total: number,
  limit: NudgeLimit = 'watchlistItems',
): Nudge => ({ type: 'limit', limit, used, total });

describe('util: toNudgeCard', () => {
  describe('for the feature nudge', () => {
    it('should read the VIP amounts from the user limits', () => {
      expect(toNudgeCard({ nudge: { type: 'vip' }, limits })).toEqual({
        kind: 'feature',
        amounts: {
          watchlistItems: limits.watchlistItems.vip,
          totalListItems: limits.totalListItems.vip,
          totalNotes: limits.totalNotes.vip,
        },
      });
    });
  });

  describe('for a limit nudge', () => {
    it('should pick the over variant above the limit', () => {
      const card = toNudgeCard({ nudge: limitNudge(7, 5), limits });

      expect(card).toMatchObject({ kind: 'limit', state: 'over' });
    });

    it('should pick the within variant below the limit', () => {
      const card = toNudgeCard({ nudge: limitNudge(830, 1000), limits });

      expect(card).toMatchObject({ kind: 'limit', state: 'within' });
    });

    it('should pick the within variant exactly at the limit', () => {
      const card = toNudgeCard({ nudge: limitNudge(5, 5), limits });

      expect(card).toMatchObject({ state: 'within' });
    });

    it.each([
      'watchlistItems',
      'totalListItems',
      'staticLists',
      'totalNotes',
    ] as const)(
      'should read the %s VIP amount from the user limits',
      (metric) => {
        const card = toNudgeCard({
          nudge: limitNudge(1, 2, metric),
          limits,
        });

        expect(card).toMatchObject({ metric, vip: limits[metric].vip });
      },
    );

    it('should keep the counts the server sent', () => {
      const card = toNudgeCard({ nudge: limitNudge(830, 1000), limits });

      expect(card).toMatchObject({ used: 830, total: 1000 });
    });
  });

  describe('meter', () => {
    const meterOf = (used: number, total: number) => {
      const card = toNudgeCard({ nudge: limitNudge(used, total), limits });
      if (card.kind !== 'limit') throw new Error('expected a limit card');

      return card.meter;
    };

    it('should fill the share of the limit that is used', () => {
      expect(meterOf(830, 1000)).toEqual({ fill: 0.83, base: 830, over: 0 });
    });

    it('should fill the whole track exactly at the limit', () => {
      expect(meterOf(5, 5)).toEqual({ fill: 1, base: 5, over: 0 });
    });

    it('should split the full track into the limit and the overage', () => {
      expect(meterOf(7, 5)).toEqual({ fill: 1, base: 5, over: 2 });
    });

    it('should stay empty with nothing used and no limit', () => {
      expect(meterOf(0, 0)).toEqual({ fill: 0, base: 0, over: 0 });
    });

    it('should show only the overage when the limit is zero', () => {
      expect(meterOf(3, 0)).toEqual({ fill: 1, base: 0, over: 3 });
    });
  });
});
