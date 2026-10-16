import { describe, expect, it } from 'vitest';
import { getSmartListFilterLabels } from './getSmartListFilterLabels.ts';

describe('getSmartListFilterLabels', () => {
  it('should label an open ended vote floor', () => {
    const [, label] = getSmartListFilterLabels({
      source: 'popular',
      filters: { imdb_votes: [5000, 999_999_999] },
    });

    expect(label).toBe('5,000+ IMDb votes');
  });

  it('should label a bounded vote range', () => {
    const [, label] = getSmartListFilterLabels({
      source: 'popular',
      filters: { votes: [100, 500] },
    });

    expect(label).toBe('100 to 500 Trakt votes');
  });

  it('should label a release window', () => {
    const [, label] = getSmartListFilterLabels({
      source: 'discover',
      filters: { released_within_days: 90 },
    });

    expect(label).toBe('Released in the last 90 days');
  });

  it('should label tmdb ratings', () => {
    const [, label] = getSmartListFilterLabels({
      source: 'discover',
      filters: { tmdb_ratings: [7, 10] },
    });

    expect(label).toBe('TMDB 7 to 10');
  });

  it('should label keywords, people and studios', () => {
    const [, ...labels] = getSmartListFilterLabels({
      source: 'discover',
      filters: {
        keywords: ['time-travel'],
        people: ['christopher-nolan'],
        studios: ['a24'],
      },
    });

    expect(labels).toEqual(['Time Travel', 'Christopher Nolan', 'A24']);
  });

  it('should label an open ended runtime with its unit', () => {
    const [, label] = getSmartListFilterLabels({
      source: 'discover',
      filters: { runtimes: [80] },
    });

    expect(label).toBe('80+ minutes');
  });

  it('should label a bounded runtime', () => {
    const [, label] = getSmartListFilterLabels({
      source: 'discover',
      filters: { runtimes: [60, 120] },
    });

    expect(label).toBe('Runtime of 60 to 120 minutes.');
  });
});
