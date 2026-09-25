import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { MovieHereticYouTubeSpecialMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticYouTubeSpecialMappedMock.ts';
import { MovieHereticYouTubeSpecialResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticYouTubeSpecialResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { movieYouTubeSpecialQuery } from './movieYouTubeSpecialQuery.ts';

const MOVIE_SLUG = MovieHereticResponseMock.ids.slug;
const YOUTUBE_SPECIAL_PATH =
  `http://localhost/v3/media/movie/${MOVIE_SLUG}/info/17/version/1`;

describe('movieYouTubeSpecialQuery', () => {
  it('should query for the movie YouTube special', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          movieYouTubeSpecialQuery({
            slug: MOVIE_SLUG,
            locale: 'en',
            enabled: true,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticYouTubeSpecialMappedMock);
  });

  it('should default the source to official when the response omits it', async () => {
    server.use(
      http.get(
        YOUTUBE_SPECIAL_PATH,
        () =>
          HttpResponse.json({
            ...MovieHereticYouTubeSpecialResponseMock,
            source: undefined,
          }),
      ),
    );

    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          movieYouTubeSpecialQuery({
            slug: MOVIE_SLUG,
            locale: 'en',
            enabled: true,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticYouTubeSpecialMappedMock);
  });

  it('should return null when the movie has no YouTube special', async () => {
    server.use(
      http.get(
        YOUTUBE_SPECIAL_PATH,
        () => new HttpResponse(null, { status: 404 }),
      ),
    );

    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          movieYouTubeSpecialQuery({
            slug: MOVIE_SLUG,
            locale: 'en',
            enabled: true,
          }),
        ),
      mapper: (response) => response?.data,
      waitFor: (response) => response === null,
    });

    expect(result).to.equal(null);
  });
});
