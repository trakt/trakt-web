import {
  SHOW_BINGE_EPISODE_THRESHOLD,
  SHOW_BINGE_WINDOW,
} from '$lib/features/toast/constants/index.ts';
import {
  EpisodeFinaleType,
  EpisodeStandardType,
} from '$lib/requests/models/EpisodeType.ts';
import { time } from '$lib/utils/timing/time.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { isShowRatingCandidate } from './isShowRatingCandidate.ts';

const now = new Date('2025-01-15T12:00:00.000Z');

const standardEpisode = {
  ...EpisodeSiloMappedMock,
  type: EpisodeStandardType.standard,
};

const finaleEpisode = {
  ...EpisodeSiloMappedMock,
  type: EpisodeFinaleType.series_finale,
};

const recentDate = (daysAgo: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  return date;
};

const recentDates = (count: number) =>
  Array.from({ length: count }, (_, i) => recentDate(i));

describe('isShowRatingCandidate', () => {
  describe('finale detection', () => {
    it('should return true for a series_finale', () => {
      expect(
        isShowRatingCandidate({
          episode: {
            ...EpisodeSiloMappedMock,
            type: EpisodeFinaleType.series_finale,
          },
          watchDates: [],
          now,
        }),
      ).toBe(true);
    });

    it('should return true for a season_finale', () => {
      expect(
        isShowRatingCandidate({
          episode: {
            ...EpisodeSiloMappedMock,
            type: EpisodeFinaleType.season_finale,
          },
          watchDates: [],
          now,
        }),
      ).toBe(true);
    });

    it('should return true for a mid_season_finale', () => {
      expect(
        isShowRatingCandidate({
          episode: {
            ...EpisodeSiloMappedMock,
            type: EpisodeFinaleType.mid_season_finale,
          },
          watchDates: [],
          now,
        }),
      ).toBe(true);
    });

    it('should return false for a standard episode with no binge', () => {
      expect(
        isShowRatingCandidate({
          episode: standardEpisode,
          watchDates: [],
          now,
        }),
      ).toBe(false);
    });
  });

  describe('binge detection', () => {
    it(`should return true when ${SHOW_BINGE_EPISODE_THRESHOLD} or more episodes were watched within the binge window`, () => {
      expect(
        isShowRatingCandidate({
          episode: standardEpisode,
          watchDates: recentDates(SHOW_BINGE_EPISODE_THRESHOLD),
          now,
        }),
      ).toBe(true);
    });

    it('should return true when more than the threshold were watched within the binge window', () => {
      expect(
        isShowRatingCandidate({
          episode: standardEpisode,
          watchDates: recentDates(SHOW_BINGE_EPISODE_THRESHOLD + 2),
          now,
        }),
      ).toBe(true);
    });

    it('should return false when fewer than the threshold were watched within the binge window', () => {
      expect(
        isShowRatingCandidate({
          episode: standardEpisode,
          watchDates: recentDates(SHOW_BINGE_EPISODE_THRESHOLD - 1),
          now,
        }),
      ).toBe(false);
    });

    it('should ignore watch dates outside the binge window', () => {
      const windowDays = SHOW_BINGE_WINDOW / time.days(1);
      const oldDates = recentDates(SHOW_BINGE_EPISODE_THRESHOLD).map((date) => {
        date.setDate(date.getDate() - windowDays);
        return date;
      });

      expect(
        isShowRatingCandidate({
          episode: standardEpisode,
          watchDates: oldDates,
          now,
        }),
      ).toBe(false);
    });

    it('should only count dates within the binge window', () => {
      const windowDays = SHOW_BINGE_WINDOW / time.days(1);
      const recentOne = recentDate(1);
      const oldOnes = recentDates(SHOW_BINGE_EPISODE_THRESHOLD).map((date) => {
        date.setDate(date.getDate() - windowDays);
        return date;
      });

      expect(
        isShowRatingCandidate({
          episode: standardEpisode,
          watchDates: [recentOne, ...oldOnes],
          now,
        }),
      ).toBe(false);
    });
  });

  describe('combined', () => {
    it('should return true for a finale even with no watch history', () => {
      expect(
        isShowRatingCandidate({
          episode: finaleEpisode,
          watchDates: [],
          now,
        }),
      ).toBe(true);
    });

    it('should return true for a finale episode that is also a binge', () => {
      expect(
        isShowRatingCandidate({
          episode: finaleEpisode,
          watchDates: recentDates(SHOW_BINGE_EPISODE_THRESHOLD),
          now,
        }),
      ).toBe(true);
    });
  });
});
