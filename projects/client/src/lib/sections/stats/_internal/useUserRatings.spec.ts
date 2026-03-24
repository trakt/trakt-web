import { describe, expect, it } from 'vitest';
import { flattenAndFilterRatings } from './useUserRatings.ts';

describe('flattenAndFilterRatings', () => {
  const now = new Date('2026-03-19T12:00:00Z');

  it('flattens all three Maps into a single array', () => {
    const result = flattenAndFilterRatings({
      movies: new Map([[1, { rating: 8, ratedAt: new Date('2026-03-18'), id: 1 }]]),
      shows: new Map([[2, { rating: 7, ratedAt: new Date('2026-03-17'), id: 2 }]]),
      episodes: new Map([[3, { rating: 9, ratedAt: new Date('2026-03-16'), id: 3 }]]),
    }, now);
    expect(result).toHaveLength(3);
    expect(result.map(r => r.type)).toEqual(['movie', 'show', 'episode']);
  });

  it('maps rating to score', () => {
    const result = flattenAndFilterRatings({
      movies: new Map([[1, { rating: 8, ratedAt: new Date('2026-03-18'), id: 1 }]]),
      shows: new Map(),
      episodes: new Map(),
    }, now);
    expect(result[0]?.score).toBe(8);
  });

  it('filters out entries older than 14 days', () => {
    const result = flattenAndFilterRatings({
      movies: new Map([
        [1, { rating: 8, ratedAt: new Date('2026-03-18'), id: 1 }],
        [2, { rating: 5, ratedAt: new Date('2026-02-01'), id: 2 }],
      ]),
      shows: new Map(),
      episodes: new Map(),
    }, now);
    expect(result).toHaveLength(1);
    expect(result[0]?.score).toBe(8);
  });

  it('returns empty array for undefined input', () => {
    const result = flattenAndFilterRatings(undefined, now);
    expect(result).toEqual([]);
  });
});
