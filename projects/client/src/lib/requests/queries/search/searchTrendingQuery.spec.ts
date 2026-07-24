import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { searchTrendingQuery } from './searchTrendingQuery.ts';

describe('searchTrendingQuery', () => {
  it('should return trending movies and shows', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(searchTrendingQuery({})),
      waitFor: (response) => Boolean(response.data),
    });

    expect(result.data?.items.map((item) => item.slug)).toEqual([
      ShowSiloResponseMock.ids.slug,
      MovieHereticResponseMock.ids.slug,
    ]);
  });

  it('should return only trending movies for the movie type', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(searchTrendingQuery({ type: 'movie' })),
      waitFor: (response) => Boolean(response.data),
    });

    expect(result.data?.items.map((item) => item.slug)).toEqual([
      MovieHereticResponseMock.ids.slug,
    ]);
  });

  it('should return only trending shows for the show type', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(searchTrendingQuery({ type: 'show' })),
      waitFor: (response) => Boolean(response.data),
    });

    expect(result.data?.items.map((item) => item.slug)).toEqual([
      ShowSiloResponseMock.ids.slug,
    ]);
  });
});
