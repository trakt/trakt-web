import { describe, expect, it } from 'vitest';
import type { MovieProgressEntry } from '../../../models/MovieProgressEntry.ts';
import { isValidProgressMovie } from './isValidProgressMovie.ts';

describe('isValidProgressMovie', () => {
  const currentDate = new Date();
  const pastDate = new Date(currentDate.getTime() - 100000);
  const futureDate = new Date(currentDate.getTime() + 100000);

  it('should return true if movie has aired and no progress info is present', () => {
    const movie = { airDate: pastDate } as MovieProgressEntry;
    expect(isValidProgressMovie(movie)).toBe(true);
  });

  it('should return false if movie has not aired yet and no progress info is present', () => {
    const movie = { airDate: futureDate } as MovieProgressEntry;
    expect(isValidProgressMovie(movie)).toBe(false);
  });

  it('should return false if movie has aired but has no valid progress (progress is a number and minutesElapsed <= 5)', () => {
    const movie = { airDate: pastDate, progress: 10, minutesElapsed: 4 } as MovieProgressEntry;
    expect(isValidProgressMovie(movie)).toBe(false);
  });

  it('should return true if movie has aired and progress is NaN', () => {
    const movie = { airDate: pastDate, progress: NaN, minutesElapsed: 0 } as MovieProgressEntry;
    expect(isValidProgressMovie(movie)).toBe(true);
  });

  it('should return true if movie has aired, progress is a number, but minutesElapsed > 5', () => {
    const movie = { airDate: pastDate, progress: 10, minutesElapsed: 6 } as MovieProgressEntry;
    expect(isValidProgressMovie(movie)).toBe(true);
  });

  it('should return false if movie has not aired, even if minutesElapsed > 5', () => {
    const movie = { airDate: futureDate, progress: 10, minutesElapsed: 10 } as MovieProgressEntry;
    expect(isValidProgressMovie(movie)).toBe(false);
  });
});
