import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { describe, expect, it } from 'vitest';
import { hasAired } from './hasAired.ts';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

describe('hasAired', () => {
  const runCommonTests = (type: ExtendedMediaType) => {
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
  };

  describe('for movies', () => {
    const type = 'movie';
    runCommonTests(type);

    it('returns true for movies that will air tomorrow', () => {
      const tomorrow = addDays(new Date(), 1);

      expect(hasAired({ airDate: tomorrow, type })).toBe(true);
    });

    it('returns true for movies that will air in 7 days', () => {
      const sevenDaysFromNow = addDays(new Date(), 7);

      expect(hasAired({ airDate: sevenDaysFromNow, type })).toBe(true);
    });

    it('returns false for movies that will air in 8 days', () => {
      const eightDaysFromNow = addDays(new Date(), 8);

      expect(hasAired({ airDate: eightDaysFromNow, type })).toBe(false);
    });
  });

  describe('for shows', () => {
    const type = 'show';
    runCommonTests(type);

    it('returns false for shows that will air tomorrow', () => {
      const tomorrow = addDays(new Date(), 1);

      expect(hasAired({ airDate: tomorrow, type })).toBe(false);
    });
  });

  describe('for episodes', () => {
    const type = 'episode';
    runCommonTests(type);

    it('returns false for episodes that will air tomorrow', () => {
      const tomorrow = addDays(new Date(), 1);

      expect(hasAired({ airDate: tomorrow, type })).toBe(false);
    });
  });
});
