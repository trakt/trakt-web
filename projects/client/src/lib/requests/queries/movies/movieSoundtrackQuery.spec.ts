import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticSoundtrackMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticSoundtrackMappedMock.ts';
import { MovieHereticSoundtrackResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticSoundtrackResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { movieSoundtrackQuery } from './movieSoundtrackQuery.ts';

const path =
  `http://localhost/v3/media/movie/${MovieHereticMappedMock.slug}/info/15/version/1`;

function query(locale: 'en' | 'pt-BR' = 'en') {
  return createTestBedQuery(
    movieSoundtrackQuery({ slug: MovieHereticMappedMock.slug, locale }),
  );
}

describe('movieSoundtrackQuery', () => {
  it('should query for the movie soundtrack', async () => {
    const result = await runQuery({
      factory: () => query(),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticSoundtrackMappedMock);
  });

  it('should order tracks by position regardless of payload order', async () => {
    server.use(
      http.get(path, () =>
        HttpResponse.json(
          [...MovieHereticSoundtrackResponseMock].reverse(),
        )),
    );

    const result = await runQuery({
      factory: () => query(),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticSoundtrackMappedMock);
  });

  it('should return an empty list when the endpoint denies access', async () => {
    server.use(
      http.get(path, () => new HttpResponse(null, { status: 401 })),
    );

    const result = await runQuery({
      factory: () => query(),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal([]);
  });

  it('should request the given locale', async () => {
    const requestedLocales: Array<string | null> = [];

    server.use(
      http.get(path, ({ request }) => {
        requestedLocales.push(new URL(request.url).searchParams.get('locale'));
        return HttpResponse.json(MovieHereticSoundtrackResponseMock);
      }),
    );

    await runQuery({
      factory: () => query('pt-BR'),
      mapper: (response) => response?.data,
    });

    expect(requestedLocales).to.deep.equal(['pt-BR']);
  });

  it('should cache per locale', () => {
    const toKey = (locale: 'en' | 'pt-BR') =>
      movieSoundtrackQuery({
        slug: MovieHereticMappedMock.slug,
        locale,
      }).queryKey;

    expect(toKey('en')).to.not.deep.equal(toKey('pt-BR'));
  });
});
