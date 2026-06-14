import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it } from 'vitest';
import { getMediaStatus } from './getMediaStatus.ts';

describe('getMediaStatus', () => {
  describe('released-in-future window', () => {
    it('returns "new" when status is released and effectiveReleaseDate is in the future', () => {
      const tomorrow = new Date(Date.now() + time.days(1));

      expect(getMediaStatus('released', tomorrow)).toBe('new');
    });

    it('returns undefined when not released and effectiveReleaseDate is in the future', () => {
      const tomorrow = new Date(Date.now() + time.days(1));

      expect(getMediaStatus('post production', tomorrow)).toBeUndefined();
    });
  });

  describe('past 7-day window', () => {
    it('returns "new" for media released within the last 7 days', () => {
      const threeDaysAgo = new Date(Date.now() - time.days(3));

      expect(getMediaStatus('released', threeDaysAgo)).toBe('new');
    });

    it('returns "new" for media released exactly 7 days ago', () => {
      const sevenDaysAgo = new Date(Date.now() - time.days(7));

      expect(getMediaStatus('released', sevenDaysAgo)).toBe('new');
    });

    it('returns undefined for media released more than 7 days ago', () => {
      const tenDaysAgo = new Date(Date.now() - time.days(10));

      expect(getMediaStatus('released', tenDaysAgo)).toBeUndefined();
    });

    it('applies the 7-day window regardless of status', () => {
      const threeDaysAgo = new Date(Date.now() - time.days(3));

      expect(getMediaStatus('post production', threeDaysAgo)).toBe('new');
    });
  });
});
