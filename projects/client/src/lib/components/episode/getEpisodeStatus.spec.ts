import {
  EpisodeFinaleType,
  EpisodePremiereType,
} from '$lib/requests/models/EpisodeType.ts';
import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it } from 'vitest';
import { getEpisodeStatus } from './getEpisodeStatus.ts';

describe('getEpisodeStatus', () => {
  describe('premiere', () => {
    it('returns "premiere" for mid_season_premiere', () => {
      expect(getEpisodeStatus(EpisodePremiereType.mid_season_premiere))
        .toBe('premiere');
    });
  });

  describe('new season', () => {
    it.each([
      EpisodePremiereType.series_premiere,
      EpisodePremiereType.season_premiere,
    ])('returns "new-season" for %s', (type) => {
      expect(getEpisodeStatus(type)).toBe('new-season');
    });

    it.each(['full_season', 'multiple_episodes'] as const)(
      'returns "new-season" for %s coalescing a season premiere',
      (type) => {
        expect(
          getEpisodeStatus(type, {
            episodes: [
              { type: EpisodePremiereType.season_premiere },
              { type: 'standard' },
            ],
          }),
        ).toBe('new-season');
      },
    );

    it('returns undefined for coalesced episodes without a season premiere', () => {
      expect(
        getEpisodeStatus('multiple_episodes', {
          episodes: [
            { type: 'standard' },
            { type: EpisodeFinaleType.season_finale },
          ],
        }),
      ).toBeUndefined();
    });

    it('returns "new-season" for a future season premiere', () => {
      const tomorrow = new Date(Date.now() + time.days(1));

      expect(
        getEpisodeStatus('multiple_episodes', {
          releaseDate: tomorrow,
          episodes: [{ type: EpisodePremiereType.season_premiere }],
        }),
      ).toBe('new-season');
    });

    it('does not treat a mid-season premiere as a new season', () => {
      expect(
        getEpisodeStatus('multiple_episodes', {
          episodes: [{ type: EpisodePremiereType.mid_season_premiere }],
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
        .toBe(type.endsWith('finale') ? 'finale' : 'new-season');
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

    it('does not return "new" when episode is a premiere', () => {
      const threeDaysAgo = new Date(Date.now() - time.days(3));

      expect(
        getEpisodeStatus(EpisodePremiereType.season_premiere, {
          releaseDate: threeDaysAgo,
        }),
      ).toBe('new-season');
    });
  });
});
