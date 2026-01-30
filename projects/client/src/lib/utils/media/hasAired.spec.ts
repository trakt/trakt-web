import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';
import { describe, expect, it } from 'vitest';
import { hasAired } from './hasAired.ts';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

describe('hasAired', () => {
  describe('for movies', () => {
    it('returns true for movies with status "released"', () => {
      expect(
        hasAired({ status: 'released', type: 'movie', airDate: new Date() }),
      ).toBe(true);
    });

    it('returns false for movies with status other than "released"', () => {
      const nonReleasedStatuses: MediaStatus[] = [
        'rumored',
        'planned',
        'in production',
        'post production',
        'canceled',
        'unknown',
      ];

      nonReleasedStatuses.forEach((status) => {
        expect(hasAired({ status, type: 'movie', airDate: new Date() })).toBe(
          false,
        );
      });
    });
  });

  const runCommonTests = (type: 'show' | 'episode') => {
    it('returns true for items that aired today', () => {
      const today = new Date();
      expect(hasAired({ airDate: today, type })).toBe(true);
    });

    it('returns true for items that aired yesterday', () => {
      const yesterday = addDays(new Date(), -1);
      expect(hasAired({ airDate: yesterday, type })).toBe(true);
    });

    it('returns true for items that aired 1 week ago', () => {
      const oneWeekAgo = addDays(new Date(), -7);
      expect(hasAired({ airDate: oneWeekAgo, type })).toBe(true);
    });

    it('returns false for items that will air tomorrow', () => {
      const tomorrow = addDays(new Date(), 1);
      expect(hasAired({ airDate: tomorrow, type })).toBe(false);
    });

    it('returns false for items that will air in 7 days', () => {
      const sevenDaysFromNow = addDays(new Date(), 7);
      expect(hasAired({ airDate: sevenDaysFromNow, type })).toBe(false);
    });
  };

  describe('for shows', () => {
    runCommonTests('show');
  });

  describe('for episodes', () => {
    runCommonTests('episode');
  });
});
