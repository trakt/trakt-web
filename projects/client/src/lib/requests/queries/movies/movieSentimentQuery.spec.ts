import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticSentimentMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticSentimentMappedMock.ts';
import { MovieHereticSentimentResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticSentimentResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { movieSentimentQuery } from './movieSentimentQuery.ts';

describe('movieSentimentQuery', () => {
  it('should query for movie sentiment', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          movieSentimentQuery({
            slug: MovieHereticMappedMock.slug,
            locale: 'en',
            enabled: true,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticSentimentMappedMock);
  });

  it('should request the given locale', async () => {
    const requestedLocales: Array<string | null> = [];

    server.use(
      http.get(
        `http://localhost/v3/media/movie/${MovieHereticMappedMock.slug}/info/0/version/1`,
        ({ request }) => {
          requestedLocales.push(
            new URL(request.url).searchParams.get('locale'),
          );
          return HttpResponse.json(MovieHereticSentimentResponseMock);
        },
      ),
    );

    await runQuery({
      factory: () =>
        createTestBedQuery(
          movieSentimentQuery({
            slug: MovieHereticMappedMock.slug,
            locale: 'pt-BR',
            enabled: true,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(requestedLocales).to.deep.equal(['pt-BR']);
  });

  it('should cache per locale', () => {
    const toKey = (locale: 'en' | 'pt-BR') =>
      movieSentimentQuery({
        slug: MovieHereticMappedMock.slug,
        locale,
        enabled: true,
      }).queryKey;

    expect(toKey('en')).to.not.deep.equal(toKey('pt-BR'));
  });
});
