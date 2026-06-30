import {
  EpisodeFinaleType,
  EpisodePremiereType,
} from '$lib/requests/models/EpisodeType.ts';
import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it, vi } from 'vitest';
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
    it('returns "new" for standard episodes released within 7 days', () => {
      const threeDaysAgo = new Date(Date.now() - time.days(3));

      expect(
        getEpisodeStatus('standard', { releaseDate: threeDaysAgo }),
      ).toBe('new');
    });

    it('returns "new" for episodes released exactly 7 days ago', () => {
      vi.useFakeTimers();
      const sevenDaysAgo = new Date(Date.now() - time.days(7));
      const result = getEpisodeStatus('standard', { releaseDate: sevenDaysAgo });
      vi.useRealTimers();
      expect(result).toBe('new');
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

    it('does not return "new" when episode is a premiere', () => {
      const threeDaysAgo = new Date(Date.now() - time.days(3));

      expect(
        getEpisodeStatus(EpisodePremiereType.season_premiere, {
          releaseDate: threeDaysAgo,
        }),
      ).toBe('premiere');
    });
  });
});
