import { mediaReactionsSummaryQuery } from '$lib/requests/queries/media/mediaReactionsSummaryQuery.ts';
import { MovieHereticReactionsSummaryMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticReactionsSummaryMappedMock.ts';
import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

const MOVIE_SLUG = MovieHereticResponseMock.ids.slug;

describe('mediaReactionsSummaryQuery', () => {
  it('should query the reactions summary for a movie', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          mediaReactionsSummaryQuery({ type: 'movie', slug: MOVIE_SLUG }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticReactionsSummaryMappedMock);
  });

  it('should report no reactions when the summary is unavailable', async () => {
    server.use(
      http.get(
        `http://localhost/v3/movies/${MOVIE_SLUG}/reactions/summary`,
        () => new HttpResponse(null, { status: 404 }),
      ),
    );

    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          mediaReactionsSummaryQuery({ type: 'movie', slug: MOVIE_SLUG }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.include({ totalCount: 0, top: [] });
  });
});
