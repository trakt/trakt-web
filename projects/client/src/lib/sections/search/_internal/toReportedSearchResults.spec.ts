import type { SearchResponse } from '$lib/features/search/models/SearchResponse.ts';
import { describe, expect, it } from 'vitest';
import { toReportedSearchResults } from './toReportedSearchResults.ts';

const mediaResponse = (count: number) =>
  ({
    type: 'media',
    items: Array.from({ length: count }, (_, index) => ({
      type: 'movie',
      title: `Movie ${index}`,
      year: index === 0 ? null : 2000 + index,
      slug: `movie-${index}`,
    })),
  }) as unknown as SearchResponse;

describe('util: toReportedSearchResults', () => {
  it('should describe media results with type, title, year and slug', () => {
    expect(toReportedSearchResults(mediaResponse(2))).toEqual([
      'movie: Movie 0 [movie-0]',
      'movie: Movie 1 (2001) [movie-1]',
    ]);
  });

  it('should describe people results by name and slug', () => {
    const response = {
      type: 'people',
      items: [{ name: 'Denis Villeneuve', slug: 'denis-villeneuve' }],
    } as unknown as SearchResponse;

    expect(toReportedSearchResults(response)).toEqual([
      'person: Denis Villeneuve [denis-villeneuve]',
    ]);
  });

  it('should keep only the first 10 results', () => {
    expect(toReportedSearchResults(mediaResponse(15))).toHaveLength(10);
  });

  it('should return nothing when there are no results yet', () => {
    expect(toReportedSearchResults(null)).toEqual([]);
  });
});
