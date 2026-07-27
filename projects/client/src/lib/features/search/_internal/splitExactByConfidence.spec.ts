import type { MediaSearchResult } from '$lib/requests/queries/search/searchMediaQuery.ts';
import { describe, expect, it } from 'vitest';
import { splitExactByConfidence } from './splitExactByConfidence.ts';

type ExactItem = MediaSearchResult['items'][number];

const item = (key: string, score: number) => ({ key, score } as ExactItem);

describe('splitExactByConfidence', () => {
  it('should lead with a unique or year-pinned hit', () => {
    const { confident, deep } = splitExactByConfidence([
      item('movie-1', 1),
      item('movie-2', 0.75),
    ]);

    expect(confident.map((entry) => entry.key)).toEqual(['movie-1', 'movie-2']);
    expect(deep).toEqual([]);
  });

  it('should hold back the deep catalog tail', () => {
    const { confident, deep } = splitExactByConfidence([
      item('movie-1', 0.25),
      item('movie-2', 0.25),
    ]);

    expect(confident).toEqual([]);
    expect(deep.map((entry) => entry.key)).toEqual(['movie-1', 'movie-2']);
  });

  it('should split a mixed result set while preserving order', () => {
    const { confident, deep } = splitExactByConfidence([
      item('movie-1', 1),
      item('movie-2', 0.25),
      item('movie-3', 0.75),
      item('movie-4', 0.25),
    ]);

    expect(confident.map((entry) => entry.key)).toEqual(['movie-1', 'movie-3']);
    expect(deep.map((entry) => entry.key)).toEqual(['movie-2', 'movie-4']);
  });

  it('should handle an empty result set', () => {
    expect(splitExactByConfidence([])).toEqual({ confident: [], deep: [] });
  });
});
