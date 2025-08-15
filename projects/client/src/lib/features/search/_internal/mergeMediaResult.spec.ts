import type {
  MediaResult,
  MediaSearchResult,
} from '$lib/requests/queries/search/searchMediaQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock.ts';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { mergeMediaSearchResult } from './mergeMediaSearchResult.ts';

describe('mergeMediaSearchResult', () => {
  const mockMovieResults: MediaResult[] = [
    {
      score: 1,
      ...MovieHereticMappedMock,
    },
    {
      score: 3,
      ...MovieMatrixMappedMock,
    },
  ];

  const mockShowResults: MediaResult[] = [
    {
      score: 2,
      ...ShowSiloMappedMock,
    },
    {
      score: 4,
      ...ShowDevsMappedMock,
    },
  ];

  const mockSearchResult: MediaSearchResult = {
    type: 'media',
    items: {
      movies: mockMovieResults,
      shows: mockShowResults,
    },
  };

  it('should merge and sort by score', () => {
    const result = mergeMediaSearchResult(mockSearchResult);

    expect(result).toHaveLength(4);
    expect(result.at(0)?.score).toBe(4);
    expect(result.at(1)?.score).toBe(3);
    expect(result.at(2)?.score).toBe(2);
    expect(result.at(3)?.score).toBe(1);
  });

  it('should return only movies when type is "movie"', () => {
    const result = mergeMediaSearchResult(mockSearchResult, 'movie');

    expect(result).toHaveLength(2);
    expect(result.every((item) => item.type === 'movie')).toBe(true);
    expect(result.at(0)?.score).toBe(3);
    expect(result.at(1)?.score).toBe(1);
  });

  it('should return only shows when type is "show"', () => {
    const result = mergeMediaSearchResult(mockSearchResult, 'show');

    expect(result).toHaveLength(2);
    expect(result.every((item) => item.type === 'show')).toBe(true);
    expect(result.at(0)?.score).toBe(4);
    expect(result.at(1)?.score).toBe(2);
  });

  it('should return empty array when no movies exist and type is "movie"', () => {
    const emptyMoviesResult: MediaSearchResult = {
      type: 'media',
      items: {
        movies: [],
        shows: mockShowResults,
      },
    };

    const result = mergeMediaSearchResult(emptyMoviesResult, 'movie');
    expect(result).toHaveLength(0);
  });

  it('should return empty array when no shows exist and type is "show"', () => {
    const emptyShowsResult: MediaSearchResult = {
      type: 'media',
      items: {
        movies: mockMovieResults,
        shows: [],
      },
    };

    const result = mergeMediaSearchResult(emptyShowsResult, 'show');
    expect(result).toHaveLength(0);
  });

  it('should return empty array when no media exists at all', () => {
    const emptyResult: MediaSearchResult = {
      type: 'media',
      items: {
        movies: [],
        shows: [],
      },
    };

    const result = mergeMediaSearchResult(emptyResult);
    expect(result).toHaveLength(0);
  });

  it('should handle single movie result', () => {
    const singleMovieResult: MediaSearchResult = {
      type: 'media',
      items: {
        movies: [assertDefined(mockMovieResults.at(0))],
        shows: [],
      },
    };

    const result = mergeMediaSearchResult(singleMovieResult);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(mockMovieResults[0]);
  });

  it('should handle single show result', () => {
    const singleShowResult: MediaSearchResult = {
      type: 'media',
      items: {
        movies: [],
        shows: [assertDefined(mockShowResults.at(0))],
      },
    };

    const result = mergeMediaSearchResult(singleShowResult);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(mockShowResults[0]);
  });
});
