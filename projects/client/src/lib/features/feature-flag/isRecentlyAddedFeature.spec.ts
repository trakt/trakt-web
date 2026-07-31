import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it } from 'vitest';
import { isRecentlyAddedFeature } from './isRecentlyAddedFeature.ts';

describe('util: isRecentlyAddedFeature', () => {
  describe('past 1-day window', () => {
    it('should return true for a feature added within the last day', () => {
      const anHourAgo = new Date(Date.now() - time.hours(1));

      expect(isRecentlyAddedFeature(anHourAgo)).toBe(true);
    });

    it('should return true for a feature added exactly a day ago', () => {
      const aDayAgo = new Date(Date.now() - time.days(1));

      expect(isRecentlyAddedFeature(aDayAgo)).toBe(true);
    });

    it('should return false for a feature added more than a day ago', () => {
      const twoDaysAgo = new Date(Date.now() - time.days(2));

      expect(isRecentlyAddedFeature(twoDaysAgo)).toBe(false);
    });
  });

  it('should return false for a feature dated in the future', () => {
    const tomorrow = new Date(Date.now() + time.days(1));

    expect(isRecentlyAddedFeature(tomorrow)).toBe(false);
  });

  it('should return false when no date is set', () => {
    expect(isRecentlyAddedFeature(null)).toBe(false);
    expect(isRecentlyAddedFeature(undefined)).toBe(false);
  });
});
