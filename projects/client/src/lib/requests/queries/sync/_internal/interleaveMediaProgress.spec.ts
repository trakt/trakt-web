import { describe, expect, it } from 'vitest';
import type { MovieProgressEntry } from '../../../models/MovieProgressEntry.ts';
import type { UpNextEntry } from '../../../models/UpNextEntry.ts';
import { interleaveMediaProgress } from './interleaveMediaProgress.ts';

const createContinueMovie = (
  key: string,
  airDate: Date,
  lastWatchedAt: Date | null = null,
): MovieProgressEntry => ({
  key,
  airDate,
  lastWatchedAt,
  intent: 'continue',
} as MovieProgressEntry);

const createStartMovie = (
  key: string,
  airDate: Date,
): MovieProgressEntry => ({
  key,
  airDate,
  intent: 'start',
} as MovieProgressEntry);

const createContinueEpisode = (
  key: string,
  showAirDate: Date,
  lastWatchedAt: Date | null = null,
): UpNextEntry => ({
  key,
  intent: 'continue',
  show: {
    airDate: showAirDate,
  },
  lastWatchedAt,
} as UpNextEntry);

const createStartEpisode = (
  key: string,
  effectiveReleaseDate: Date,
): UpNextEntry => ({
  key,
  intent: 'start',
  effectiveReleaseDate,
} as UpNextEntry);

describe('interleaveMediaProgress', () => {
  describe('with empty arrays', () => {
    it('should return an empty array', () => {
      const result = interleaveMediaProgress({
        episodes: [],
        movies: [],
      });

      expect(result).toEqual([]);
    });

    it('should return only movies', () => {
      const movies = [
        createContinueMovie('movie-2', new Date('2024-01-02')),
        createContinueMovie('movie-1', new Date('2024-01-01')),
      ];

      const result = interleaveMediaProgress({
        episodes: [],
        movies,
      });

      expect(result).toEqual(movies);
    });

    it('should return only episodes', () => {
      const episodes = [
        createContinueEpisode('episode-2', new Date('2024-01-02')),
        createContinueEpisode('episode-1', new Date('2024-01-01')),
      ];

      const result = interleaveMediaProgress({
        episodes,
        movies: [],
      });

      expect(result).toEqual(episodes);
    });
  });

  describe('with "start" intent', () => {
    it('should interleave based on airDate', () => {
      const episodes = [
        createStartEpisode('episode-2', new Date('2024-01-10')),
        createStartEpisode('episode-1', new Date('2024-01-01')),
      ];
      const movies = [
        createStartMovie('movie-4', new Date('2024-01-12')),
        createStartMovie('movie-3', new Date('2024-01-11')),
        createStartMovie('movie-2', new Date('2024-01-03')),
        createStartMovie('movie-1', new Date('2024-01-02')),
      ];

      const result = interleaveMediaProgress({
        episodes,
        movies,
      });

      expect(result).toHaveLength(6);
      expect(result[0]!.key).toBe('movie-4');
      expect(result[1]!.key).toBe('movie-3');
      expect(result[2]!.key).toBe('episode-2');
      expect(result[3]!.key).toBe('movie-2');
      expect(result[4]!.key).toBe('movie-1');
      expect(result[5]!.key).toBe('episode-1');
    });
  });

  describe('with "continue" intent', () => {
    it('should interleave movies based on lastWatchedAt', () => {
      const episodes = [
        createContinueEpisode(
          'episode-2',
          new Date('2023-01-01'),
          new Date('2024-01-05'),
        ),
        createContinueEpisode(
          'episode-1',
          new Date('2023-01-01'),
          new Date('2024-01-01'),
        ),
      ];
      const movies = [
        createContinueMovie(
          'movie-2',
          new Date('2023-01-01'),
          new Date('2024-01-07'),
        ),
        createContinueMovie(
          'movie-1',
          new Date('2023-01-01'),
          new Date('2024-01-03'),
        ),
      ];

      const result = interleaveMediaProgress({
        episodes,
        movies,
      });

      expect(result).toHaveLength(4);
      expect(result[0]!.key).toBe('movie-2');
      expect(result[1]!.key).toBe('episode-2');
      expect(result[2]!.key).toBe('movie-1');
      expect(result[3]!.key).toBe('episode-1');
    });
  });
});
