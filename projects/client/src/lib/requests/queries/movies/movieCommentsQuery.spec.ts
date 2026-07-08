import { MovieHereticCommentsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticCommentsMappedMock.ts';
import { MovieHereticCommentsResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticCommentsResponseMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { movieCommentsQuery } from './movieCommentsQuery.ts';

describe('movieCommentsQuery', () => {
  it('should query for comments on a movie', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          movieCommentsQuery({
            slug: MovieHereticMappedMock.slug,
            limit: 10,
            sort: 'likes',
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(MovieHereticCommentsMappedMock);
  });

  it('should forward the language filter to the request', async () => {
    let requestedLanguage: string | null = null;

    server.use(
      http.get(
        `http://localhost/movies/${MovieHereticMappedMock.slug}/comments/likes`,
        ({ request }) => {
          requestedLanguage = new URL(request.url).searchParams.get('language');
          return HttpResponse.json(MovieHereticCommentsResponseMock);
        },
      ),
    );

    await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          movieCommentsQuery({
            slug: MovieHereticMappedMock.slug,
            limit: 10,
            sort: 'likes',
            language: 'fr',
          }),
        ),
      mapper: mapToEntries,
    });

    expect(requestedLanguage).to.equal('fr');
  });
});
