import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { hasSeasonTitles } from './hasSeasonTitles.ts';

describe('util: hasSeasonTitles', () => {
  it('should return false for an empty list', () => {
    expect(hasSeasonTitles([])).toBe(false);
  });

  it('should return false when no season has a title', () => {
    expect(hasSeasonTitles(ShowSiloSeasonsMappedMock)).toBe(false);
  });

  it('should return true when a single season has a title', () => {
    const seasons = ShowSiloSeasonsMappedMock.map((season, index) =>
      index === 0 ? { ...season, title: 'Murder House' } : season
    );

    expect(hasSeasonTitles(seasons)).toBe(true);
  });

  it('should return false when titles are empty', () => {
    const seasons = ShowSiloSeasonsMappedMock.map((season) => ({
      ...season,
      title: '',
    }));

    expect(hasSeasonTitles(seasons)).toBe(false);
  });
});
