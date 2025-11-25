import { describe, expect, it } from 'vitest';
import type { MovieProgressEntry } from '../movieProgressQuery.ts';
import type { UpNextEntry } from '../upNextNitroQuery.ts';
import { interleaveMediaProgress } from './interleaveMediaProgress.ts';

const createMovie = (
  key: string,
  airDate: Date,
  lastWatchedAt: Date | null = null,
): MovieProgressEntry => ({
  key,
  airDate,
  lastWatchedAt,
} as MovieProgressEntry);

const createEpisode = (
  key: string,
  showAirDate: Date,
  lastWatchedAt: Date | null = null,
): UpNextEntry => ({
  key,
  show: {
    airDate: showAirDate,
  },
  lastWatchedAt,
} as UpNextEntry);

describe('interleaveMediaProgress', () => {
  describe('with empty arrays', () => {
    it('should return an empty array', () => {
      const result = interleaveMediaProgress({
        intent: 'start',
        episodes: [],
        movies: [],
      });

      expect(result).toEqual([]);
    });

    it('should return only movies', () => {
      const movies = [
        createMovie('movie-2', new Date('2024-01-02')),
        createMovie('movie-1', new Date('2024-01-01')),
      ];

      const result = interleaveMediaProgress({
        intent: 'start',
        episodes: [],
        movies,
      });

      expect(result).toEqual(movies);
    });

    it('should return only episodes', () => {
      const episodes = [
        createEpisode('episode-2', new Date('2024-01-02')),
        createEpisode('episode-1', new Date('2024-01-01')),
      ];

      const result = interleaveMediaProgress({
        intent: 'start',
        episodes,
        movies: [],
      });

      expect(result).toEqual(episodes);
    });
  });

  describe('with "start" intent', () => {
    it('should interleave based on airDate', () => {
      const episodes = [
        createEpisode('episode-2', new Date('2024-01-10')),
        createEpisode('episode-1', new Date('2024-01-01')),
      ];
      const movies = [
        createMovie('movie-4', new Date('2024-01-12')),
        createMovie('movie-3', new Date('2024-01-11')),
        createMovie('movie-2', new Date('2024-01-03')),
        createMovie('movie-1', new Date('2024-01-02')),
      ];

      const result = interleaveMediaProgress({
        intent: 'start',
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
        createEpisode(
          'episode-2',
          new Date('2023-01-01'),
          new Date('2024-01-05'),
        ),
        createEpisode(
          'episode-1',
          new Date('2023-01-01'),
          new Date('2024-01-01'),
        ),
      ];
      const movies = [
        createMovie('movie-2', new Date('2023-01-01'), new Date('2024-01-07')),
        createMovie('movie-1', new Date('2023-01-01'), new Date('2024-01-03')),
      ];

      const result = interleaveMediaProgress({
        intent: 'continue',
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
