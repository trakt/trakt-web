import { describe, expect, it } from 'vitest';
import type { MovieProgressEntry } from '../../../models/MovieProgressEntry.ts';
import type { UpNextEntry } from '../../../models/UpNextEntry.ts';
import { interleaveMediaProgress } from './interleaveMediaProgress.ts';

const createContinueMovie = (
  key: string,
  airDate: Date = new Date('2020-01-01'),
  lastWatchedAt: Date | null = null,
  effectiveReleaseDate: Date = airDate,
): MovieProgressEntry =>
  ({
    key,
    airDate,
    lastWatchedAt,
    effectiveReleaseDate,
  }) as MovieProgressEntry;

const createContinueEpisode = (
  key: string,
  showAirDate: Date = new Date('2020-01-01'),
  lastWatchedAt: Date | null = null,
  effectiveReleaseDate: Date = showAirDate,
  remaining = 1,
): UpNextEntry =>
  ({
    key,
    show: { airDate: showAirDate },
    lastWatchedAt,
    effectiveReleaseDate,
    remaining,
  }) as UpNextEntry;

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

  describe('with progress data', () => {
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

  describe('sorting by released', () => {
    it('should interleave by effectiveReleaseDate descending', () => {
      const episodes = [
        createContinueEpisode(
          'episode-2',
          new Date('2020-01-01'),
          null,
          new Date('2024-03-01'),
        ),
        createContinueEpisode(
          'episode-1',
          new Date('2020-01-01'),
          null,
          new Date('2024-01-01'),
        ),
      ];
      const movies = [
        createContinueMovie(
          'movie-a',
          new Date('2020-01-01'),
          null,
          new Date('2024-04-01'),
        ),
        createContinueMovie(
          'movie-b',
          new Date('2020-01-01'),
          null,
          new Date('2024-02-01'),
        ),
      ];

      const result = interleaveMediaProgress({
        episodes,
        movies,
        sortBy: 'released',
        sortHow: 'desc',
      });

      expect(result.map((e) => e.key)).toEqual([
        'movie-a',
        'episode-2',
        'movie-b',
        'episode-1',
      ]);
    });

    it('should interleave by effectiveReleaseDate ascending', () => {
      const episodes = [
        createContinueEpisode(
          'episode-1',
          new Date('2020-01-01'),
          null,
          new Date('2024-01-01'),
        ),
        createContinueEpisode(
          'episode-2',
          new Date('2020-01-01'),
          null,
          new Date('2024-03-01'),
        ),
      ];
      const movies = [
        createContinueMovie(
          'movie-a',
          new Date('2020-01-01'),
          null,
          new Date('2023-12-01'),
        ),
        createContinueMovie(
          'movie-b',
          new Date('2020-01-01'),
          null,
          new Date('2024-02-01'),
        ),
      ];

      const result = interleaveMediaProgress({
        episodes,
        movies,
        sortBy: 'released',
        sortHow: 'asc',
      });

      expect(result.map((e) => e.key)).toEqual([
        'movie-a',
        'episode-1',
        'movie-b',
        'episode-2',
      ]);
    });
  });

  describe('sorting by remaining', () => {
    it('should place all movies before episodes since movies have no remaining', () => {
      const episodes = [
        createContinueEpisode(
          'episode-1',
          new Date('2020-01-01'),
          null,
          undefined,
          5,
        ),
        createContinueEpisode(
          'episode-2',
          new Date('2020-01-01'),
          null,
          undefined,
          2,
        ),
      ];
      const movies = [
        createContinueMovie('movie-1'),
        createContinueMovie('movie-2'),
      ];

      const result = interleaveMediaProgress({
        episodes,
        movies,
        sortBy: 'remaining',
        sortHow: 'asc',
      });

      expect(result[0]!.key).toBe('movie-1');
      expect(result[1]!.key).toBe('movie-2');
      expect(result[2]!.key).toBe('episode-1');
      expect(result[3]!.key).toBe('episode-2');
    });
  });
});
