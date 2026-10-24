import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { RealityCheckPublicMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckPublicMappedMock.ts';
import { RealityCheckVipMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckVipMappedMock.ts';
import { RealityCheckPublicResponseMock } from '$mocks/data/summary/reality-check/response/RealityCheckPublicResponseMock.ts';
import { RealityCheckVipResponseMock } from '$mocks/data/summary/reality-check/response/RealityCheckVipResponseMock.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { movieRealityCheckQuery } from './movieRealityCheckQuery.ts';

const REALITY_CHECK_URL = `http://localhost/v3/media/movie/${MovieHereticMappedMock.slug}/info/34/version/1`;

function queryRealityCheck(locale: 'en' | 'pt-BR' = 'en') {
  return runQuery({
    factory: () =>
      createTestBedQuery(
        movieRealityCheckQuery({
          slug: MovieHereticMappedMock.slug,
          locale,
          enabled: true,
        }),
      ),
    waitFor: (data) => data !== undefined,
    mapper: (response) => response?.data,
  });
}

describe('movieRealityCheckQuery', () => {
  it('should query the public shape for free users', async () => {
    server.use(
      http.get(REALITY_CHECK_URL, () =>
        HttpResponse.json(RealityCheckPublicResponseMock),
      ),
    );

    expect(await queryRealityCheck()).to.deep.equal(
      RealityCheckPublicMappedMock,
    );
  });

  it('should query the full shape for VIP users', async () => {
    server.use(
      http.get(REALITY_CHECK_URL, () =>
        HttpResponse.json(RealityCheckVipResponseMock),
      ),
    );

    expect(await queryRealityCheck()).to.deep.equal(RealityCheckVipMappedMock);
  });

  it('should resolve to nothing when the title has no Reality Check', async () => {
    expect(await queryRealityCheck()).to.equal(null);
  });

  it('should request the given locale', async () => {
    const requestedLocales: Array<string | null> = [];

    server.use(
      http.get(REALITY_CHECK_URL, ({ request }) => {
        requestedLocales.push(new URL(request.url).searchParams.get('locale'));
        return HttpResponse.json(RealityCheckPublicResponseMock);
      }),
    );

    await queryRealityCheck('pt-BR');

    expect(requestedLocales).to.deep.equal(['pt-BR']);
  });

  it('should cache per locale', () => {
    const toKey = (locale: 'en' | 'pt-BR') =>
      movieRealityCheckQuery({
        slug: MovieHereticMappedMock.slug,
        locale,
        enabled: true,
      }).queryKey;

    expect(toKey('en')).to.not.deep.equal(toKey('pt-BR'));
  });

  it('should refetch when the VIP status changes', () => {
    const { queryKey } = movieRealityCheckQuery({
      slug: MovieHereticMappedMock.slug,
      locale: 'en',
      enabled: true,
    });

    expect(queryKey).to.include(InvalidateAction.Vip.Updated);
  });
});
