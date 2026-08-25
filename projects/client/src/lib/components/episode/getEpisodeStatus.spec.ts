import {
  EpisodeFinaleType,
  EpisodePremiereType,
} from '$lib/requests/models/EpisodeType.ts';
import { time } from '$lib/utils/timing/time.ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getEpisodeStatus } from './getEpisodeStatus.ts';

describe('getEpisodeStatus', () => {
  describe('premiere', () => {
    it.each([
      EpisodePremiereType.series_premiere,
      EpisodePremiereType.season_premiere,
      EpisodePremiereType.mid_season_premiere,
    ])('returns "premiere" for %s', (type) => {
      expect(getEpisodeStatus(type)).toBe('premiere');
    });
  });

  describe('coalesced days', () => {
    it.each(['full_season', 'multiple_episodes'] as const)(
      'returns "premiere" for %s carrying a season premiere',
      (type) => {
        expect(
          getEpisodeStatus(type, {
            episodes: [
              { type: EpisodePremiereType.season_premiere },
              { type: 'standard' },
            ],
          }),
        ).toBe('premiere');
      },
    );

    it('returns "premiere" for a coalesced day that has not aired yet', () => {
      const tomorrow = new Date(Date.now() + time.days(1));

      expect(
        getEpisodeStatus('multiple_episodes', {
          releaseDate: tomorrow,
          episodes: [
            { type: EpisodePremiereType.season_premiere },
            { type: 'standard' },
          ],
        }),
      ).toBe('premiere');
    });

    it('returns "finale" for a coalesced day carrying a season finale', () => {
      expect(
        getEpisodeStatus('multiple_episodes', {
          episodes: [
            { type: 'standard' },
            { type: EpisodeFinaleType.season_finale },
          ],
        }),
      ).toBe('finale');
    });

    it('prefers the premiere when a full season carries both', () => {
      expect(
        getEpisodeStatus('full_season', {
          episodes: [
            { type: EpisodePremiereType.season_premiere },
            { type: EpisodeFinaleType.series_finale },
          ],
        }),
      ).toBe('premiere');
    });

    it('returns undefined for coalesced standard episodes', () => {
      expect(
        getEpisodeStatus('multiple_episodes', {
          episodes: [{ type: 'standard' }, { type: 'standard' }],
        }),
      ).toBeUndefined();
    });

    it.each(['standard', 'unknown'] as const)(
      'ignores coalesced episodes for non-computed type %s',
      (type) => {
        expect(
          getEpisodeStatus(type, {
            episodes: [{ type: EpisodePremiereType.season_premiere }],
          }),
        ).toBeUndefined();
      },
    );
  });

  describe('finale', () => {
    it.each([
      EpisodeFinaleType.series_finale,
      EpisodeFinaleType.season_finale,
      EpisodeFinaleType.mid_season_finale,
    ])('returns "finale" for %s', (type) => {
      expect(getEpisodeStatus(type)).toBe('finale');
    });
  });

  describe('no status', () => {
    it.each(
      ['standard', 'unknown', 'full_season', 'multiple_episodes'] as const,
    )('returns undefined for %s', (type) => {
      expect(getEpisodeStatus(type)).toBeUndefined();
    });
  });

  describe('mid-season staleness gate', () => {
    it.each([
      EpisodeFinaleType.mid_season_finale,
      EpisodePremiereType.mid_season_premiere,
    ])('returns undefined for %s when not the latest aired', (type) => {
      expect(
        getEpisodeStatus(type, { isLatestAired: false }),
      ).toBeUndefined();
    });

    it.each(
      [
        [EpisodeFinaleType.mid_season_finale, 'finale'],
        [EpisodePremiereType.mid_season_premiere, 'premiere'],
      ] as const,
    )(
      'returns %s status for %s when it is the latest aired',
      (type, expected) => {
        expect(
          getEpisodeStatus(type, { isLatestAired: true }),
        ).toBe(expected);
      },
    );

    it.each([
      EpisodeFinaleType.series_finale,
      EpisodeFinaleType.season_finale,
      EpisodePremiereType.series_premiere,
      EpisodePremiereType.season_premiere,
    ])('does not gate non-mid-season %s', (type) => {
      expect(getEpisodeStatus(type, { isLatestAired: false }))
        .toBe(type.endsWith('finale') ? 'finale' : 'premiere');
    });
  });

  describe('new status', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-15T00:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns "new" for standard episodes released within 7 days', () => {
      const threeDaysAgo = new Date(Date.now() - time.days(3));

      expect(
        getEpisodeStatus('standard', { releaseDate: threeDaysAgo }),
      ).toBe('new');
    });

    it('returns "new" for episodes released exactly 7 days ago', () => {
      const sevenDaysAgo = new Date(Date.now() - time.days(7));

      expect(
        getEpisodeStatus('standard', { releaseDate: sevenDaysAgo }),
      ).toBe('new');
    });

    it('returns undefined for episodes released more than 7 days ago', () => {
      const tenDaysAgo = new Date(Date.now() - time.days(10));

      expect(
        getEpisodeStatus('standard', { releaseDate: tenDaysAgo }),
      ).toBeUndefined();
    });

    it('returns undefined for episodes released in the future', () => {
      const tomorrow = new Date(Date.now() + time.days(1));

      expect(
        getEpisodeStatus('standard', { releaseDate: tomorrow }),
      ).toBeUndefined();
    });

    it('combines into "new-premiere" rather than two statuses', () => {
      const threeDaysAgo = new Date(Date.now() - time.days(3));

      expect(
        getEpisodeStatus(EpisodePremiereType.season_premiere, {
          releaseDate: threeDaysAgo,
        }),
      ).toBe('new-premiere');
    });

    it('combines into "new-finale"', () => {
      const threeDaysAgo = new Date(Date.now() - time.days(3));

      expect(
        getEpisodeStatus(EpisodeFinaleType.season_finale, {
          releaseDate: threeDaysAgo,
        }),
      ).toBe('new-finale');
    });

    it('combines into "new-premiere" for a coalesced premiere day', () => {
      const threeDaysAgo = new Date(Date.now() - time.days(3));

      expect(
        getEpisodeStatus('multiple_episodes', {
          releaseDate: threeDaysAgo,
          episodes: [
            { type: EpisodePremiereType.season_premiere },
            { type: 'standard' },
          ],
        }),
      ).toBe('new-premiere');
    });

    it('keeps "new" when the mid-season gate drops the milestone', () => {
      const threeDaysAgo = new Date(Date.now() - time.days(3));

      expect(
        getEpisodeStatus(EpisodePremiereType.mid_season_premiere, {
          releaseDate: threeDaysAgo,
          isLatestAired: false,
        }),
      ).toBe('new');
    });
  });
});
