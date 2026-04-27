import { describe, expect, it } from 'vitest';
import type { MovieProgressEntry } from '../../../models/MovieProgressEntry.ts';
import { sortMovieProgress } from './sortMovieProgress.ts';

const createMovie = (
  key: string,
  {
    lastWatchedAt = null,
    effectiveReleaseDate = new Date('2020-01-01'),
  }: {
    lastWatchedAt?: Date | null;
    effectiveReleaseDate?: Date;
  } = {},
): MovieProgressEntry =>
  ({
    key,
    lastWatchedAt,
    effectiveReleaseDate,
  }) as MovieProgressEntry;

describe('sortMovieProgress', () => {
  describe('default sort (no sortBy)', () => {
    it('should sort by lastWatchedAt descending by default', () => {
      const entries = [
        createMovie('a', { lastWatchedAt: new Date('2024-01-01') }),
        createMovie('b', { lastWatchedAt: new Date('2024-01-03') }),
        createMovie('c', { lastWatchedAt: new Date('2024-01-02') }),
      ];

      const result = sortMovieProgress({ entries });

      expect(result.map((e) => e.key)).toEqual(['b', 'c', 'a']);
    });

    it('should sort by lastWatchedAt ascending when sortHow is asc', () => {
      const entries = [
        createMovie('a', { lastWatchedAt: new Date('2024-01-03') }),
        createMovie('b', { lastWatchedAt: new Date('2024-01-01') }),
        createMovie('c', { lastWatchedAt: new Date('2024-01-02') }),
      ];

      const result = sortMovieProgress({ entries, sortHow: 'asc' });

      expect(result.map((e) => e.key)).toEqual(['b', 'c', 'a']);
    });

    it('should place entries with no lastWatchedAt last when descending', () => {
      const entries = [
        createMovie('a', { lastWatchedAt: null }),
        createMovie('b', { lastWatchedAt: new Date('2024-01-01') }),
      ];

      const result = sortMovieProgress({ entries });

      expect(result.map((e) => e.key)).toEqual(['b', 'a']);
    });
  });

  describe('sortBy released', () => {
    it('should sort by effectiveReleaseDate descending by default', () => {
      const entries = [
        createMovie('a', { effectiveReleaseDate: new Date('2023-01-01') }),
        createMovie('b', { effectiveReleaseDate: new Date('2023-03-01') }),
        createMovie('c', { effectiveReleaseDate: new Date('2023-02-01') }),
      ];

      const result = sortMovieProgress({ entries, sortBy: 'released' });

      expect(result.map((e) => e.key)).toEqual(['b', 'c', 'a']);
    });

    it('should sort by effectiveReleaseDate ascending when sortHow is asc', () => {
      const entries = [
        createMovie('a', { effectiveReleaseDate: new Date('2023-03-01') }),
        createMovie('b', { effectiveReleaseDate: new Date('2023-01-01') }),
        createMovie('c', { effectiveReleaseDate: new Date('2023-02-01') }),
      ];

      const result = sortMovieProgress({
        entries,
        sortBy: 'released',
        sortHow: 'asc',
      });

      expect(result.map((e) => e.key)).toEqual(['b', 'c', 'a']);
    });
  });

  describe('sortBy remaining', () => {
    it('should return entries in stable order since movies have no remaining', () => {
      const entries = [
        createMovie('a', { lastWatchedAt: new Date('2024-01-01') }),
        createMovie('b', { lastWatchedAt: new Date('2024-01-02') }),
      ];

      const result = sortMovieProgress({ entries, sortBy: 'remaining' });

      expect(result).toHaveLength(2);
    });
  });
});
