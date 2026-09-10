import { mediaParentalGuideQuery } from '$lib/requests/queries/media/mediaParentalGuideQuery.ts';
import { MediaParentalGuideResponseMock } from '$mocks/data/summary/common/response/MediaParentalGuideResponseMock.ts';
import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

const MOVIE_SLUG = MovieHereticResponseMock.ids.slug;
const PARENTAL_GUIDE_PATH =
  `http://localhost/v3/media/movie/${MOVIE_SLUG}/info/16/version/1`;

describe('mediaParentalGuideQuery', () => {
  it('should query for a movie parental guide by slug', async () => {
    server.use(
      http.get(
        PARENTAL_GUIDE_PATH,
        () => HttpResponse.json(MediaParentalGuideResponseMock),
      ),
    );

    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          mediaParentalGuideQuery({
            type: 'movie',
            slug: MOVIE_SLUG,
            locale: 'en',
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MediaParentalGuideResponseMock);
  });

  it('should return null when a media parental guide is unavailable', async () => {
    server.use(
      http.get(
        PARENTAL_GUIDE_PATH,
        () => new HttpResponse(null, { status: 404 }),
      ),
    );

    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          mediaParentalGuideQuery({
            type: 'movie',
            slug: MOVIE_SLUG,
            locale: 'en',
          }),
        ),
      mapper: (response) => response?.data,
      waitFor: (response) => response === null,
    });

    expect(result).to.equal(null);
  });

  it('should request the given locale', async () => {
    const requestedLocales: Array<string | null> = [];

    server.use(
      http.get(PARENTAL_GUIDE_PATH, ({ request }) => {
        requestedLocales.push(new URL(request.url).searchParams.get('locale'));
        return HttpResponse.json(MediaParentalGuideResponseMock);
      }),
    );

    await runQuery({
      factory: () =>
        createTestBedQuery(
          mediaParentalGuideQuery({
            type: 'movie',
            slug: MOVIE_SLUG,
            locale: 'pt-BR',
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(requestedLocales).to.deep.equal(['pt-BR']);
  });
});
