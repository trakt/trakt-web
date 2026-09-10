import { MoviesTrendingMappedMock } from '$mocks/data/movies/mapped/MoviesTrendingMappedMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import {
  movieTrendingQuery,
  movieTrendingRequest,
} from './movieTrendingQuery.ts';

describe('movieTrendingQuery', () => {
  it('should send parental guidance ranges to the API unchanged', async () => {
    const filter = {
      parental_nudity: '0-0',
      parental_violence: '0-1',
      parental_profanity: '1-2',
      parental_alcohol: '2-3',
      parental_frightening: '3-3',
    };
    let requestedUrl: URL | undefined;
    server.use(http.get('http://localhost/movies/trending', ({ request }) => {
      requestedUrl = new URL(request.url);
      return HttpResponse.json([]);
    }));

    await movieTrendingRequest({ filter, limit: 10 });

    Object.entries(filter).forEach(([key, value]) => {
      expect(requestedUrl?.searchParams.get(key)).toBe(value);
    });
  });

  it('should query trending movies', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          movieTrendingQuery(),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(MoviesTrendingMappedMock);
  });
});
