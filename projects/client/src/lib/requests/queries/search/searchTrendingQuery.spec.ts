import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { searchTrendingQuery } from './searchTrendingQuery.ts';

describe('searchTrendingQuery', () => {
  async function trendingSlugs(type?: MediaType) {
    const result = await runQuery({
      factory: () => createTestBedQuery(searchTrendingQuery({ type })),
      waitFor: (response) => Boolean(response.data),
    });

    return result.data?.items.map((item) => item.slug);
  }

  it('should return trending movies and shows', async () => {
    expect(await trendingSlugs()).toEqual([
      ShowSiloResponseMock.ids.slug,
      MovieHereticResponseMock.ids.slug,
    ]);
  });

  it('should return only trending movies for the movie type', async () => {
    expect(await trendingSlugs('movie')).toEqual([
      MovieHereticResponseMock.ids.slug,
    ]);
  });

  it('should return only trending shows for the show type', async () => {
    expect(await trendingSlugs('show')).toEqual([
      ShowSiloResponseMock.ids.slug,
    ]);
  });
});
