import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { hasAired } from './hasAired.ts';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

describe('hasAired', () => {
  beforeEach(() => {
    // Freeze time to keep buffer boundary assertions deterministic.
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('for movies', () => {
    it('returns true for movies with status "released"', () => {
      expect(
        hasAired({
          status: 'released',
          type: 'movie',
          effectiveReleaseDate: new Date(),
        }),
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

      const futureDate = addDays(new Date(), 1);
      nonReleasedStatuses.forEach((status) => {
        expect(
          hasAired({
            status,
            type: 'movie',
            effectiveReleaseDate: futureDate,
          }),
        ).toBe(false);
      });
    });

    it('returns true for movies with a past air date and non-released status', () => {
      expect(
        hasAired({
          status: 'post production',
          type: 'movie',
          effectiveReleaseDate: new Date(),
        }),
      ).toBe(true);
    });

    it('returns true for movies released on streaming with a future air date', () => {
      const yesterday = addDays(new Date(), -1);
      expect(
        hasAired({
          type: 'movie',
          effectiveReleaseDate: yesterday,
        }),
      ).toBe(true);
    });

    it('returns true for movies released on streaming with a future air date and non-released status', () => {
      const yesterday = addDays(new Date(), -1);
      expect(
        hasAired({
          status: 'post production',
          type: 'movie',
          effectiveReleaseDate: yesterday,
        }),
      ).toBe(true);
    });
  });

  const runCommonTests = (type: 'show' | 'episode') => {
    it('returns true for items that aired today', () => {
      const today = new Date();
      expect(hasAired({ effectiveReleaseDate: today, type })).toBe(true);
    });

    it('returns true for items that aired yesterday', () => {
      const yesterday = addDays(new Date(), -1);
      expect(
        hasAired({ effectiveReleaseDate: yesterday, type }),
      ).toBe(true);
    });

    it('returns true for items that aired 1 week ago', () => {
      const oneWeekAgo = addDays(new Date(), -7);
      expect(
        hasAired({ effectiveReleaseDate: oneWeekAgo, type }),
      ).toBe(true);
    });

    if (type !== 'episode') {
      it('returns false for items that will air tomorrow', () => {
        const tomorrow = addDays(new Date(), 1);
        expect(
          hasAired({ effectiveReleaseDate: tomorrow, type }),
        ).toBe(false);
      });
    }

    it('returns false for items that will air in 2 days', () => {
      const inTwoDays = addDays(new Date(), 2);
      expect(
        hasAired({ effectiveReleaseDate: inTwoDays, type }),
      ).toBe(false);
    });

    it('returns false for items that will air in 7 days', () => {
      const sevenDaysFromNow = addDays(new Date(), 7);
      expect(
        hasAired({ effectiveReleaseDate: sevenDaysFromNow, type }),
      ).toBe(false);
    });

    it('returns true for items released on streaming with a future air date', () => {
      const yesterday = addDays(new Date(), -1);
      expect(
        hasAired({ effectiveReleaseDate: yesterday, type }),
      ).toBe(true);
    });
  };

  describe('for shows', () => {
    runCommonTests('show');
  });

  describe('for episodes', () => {
    runCommonTests('episode');
  });

  describe('episode air buffer', () => {
    const DAY_MS = 24 * 60 * 60 * 1000;

    it('treats an episode airing within 24h as aired', () => {
      const inTwelveHours = new Date(Date.now() + DAY_MS / 2);
      expect(
        hasAired({
          effectiveReleaseDate: inTwelveHours,
          type: 'episode',
        }),
      ).toBe(true);
    });

    it('does not treat an episode airing beyond 24h as aired', () => {
      const inTwoDays = new Date(Date.now() + DAY_MS * 2);
      expect(
        hasAired({
          effectiveReleaseDate: inTwoDays,
          type: 'episode',
        }),
      ).toBe(false);
    });

    it('does not apply the buffer to shows', () => {
      const inTwelveHours = new Date(Date.now() + DAY_MS / 2);
      expect(
        hasAired({
          effectiveReleaseDate: inTwelveHours,
          type: 'show',
        }),
      ).toBe(false);
    });

    it('does not apply the buffer to movies', () => {
      const inTwelveHours = new Date(Date.now() + DAY_MS / 2);
      expect(
        hasAired({
          effectiveReleaseDate: inTwelveHours,
          type: 'movie',
        }),
      ).toBe(false);
    });
  });
});
