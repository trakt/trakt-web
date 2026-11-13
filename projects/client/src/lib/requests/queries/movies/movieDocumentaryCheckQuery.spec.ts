import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { DocumentaryCheckPublicMappedMock } from '$mocks/data/summary/documentary-check/mapped/DocumentaryCheckPublicMappedMock.ts';
import { DocumentaryCheckVipMappedMock } from '$mocks/data/summary/documentary-check/mapped/DocumentaryCheckVipMappedMock.ts';
import { DocumentaryCheckPublicResponseMock } from '$mocks/data/summary/documentary-check/response/DocumentaryCheckPublicResponseMock.ts';
import { DocumentaryCheckVipResponseMock } from '$mocks/data/summary/documentary-check/response/DocumentaryCheckVipResponseMock.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { movieDocumentaryCheckQuery } from './movieDocumentaryCheckQuery.ts';

const DOCUMENTARY_CHECK_URL = `http://localhost/v3/media/movie/${MovieHereticMappedMock.slug}/info/66/version/1`;

function queryDocumentaryCheck(locale: 'en' | 'pt-BR' = 'en') {
  return runQuery({
    factory: () =>
      createTestBedQuery(
        movieDocumentaryCheckQuery({
          slug: MovieHereticMappedMock.slug,
          locale,
          enabled: true,
        }),
      ),
    waitFor: (data) => data !== undefined,
    mapper: (response) => response?.data,
  });
}

describe('movieDocumentaryCheckQuery', () => {
  it('should query the public shape for free users', async () => {
    server.use(
      http.get(DOCUMENTARY_CHECK_URL, () =>
        HttpResponse.json(DocumentaryCheckPublicResponseMock),
      ),
    );

    expect(await queryDocumentaryCheck()).to.deep.equal(
      DocumentaryCheckPublicMappedMock,
    );
  });

  it('should query the full shape for VIP users', async () => {
    server.use(
      http.get(DOCUMENTARY_CHECK_URL, () =>
        HttpResponse.json(DocumentaryCheckVipResponseMock),
      ),
    );

    expect(await queryDocumentaryCheck()).to.deep.equal(
      DocumentaryCheckVipMappedMock,
    );
  });

  it('should resolve to nothing when the title has no Documentary Check', async () => {
    server.use(
      http.get(
        DOCUMENTARY_CHECK_URL,
        () => new HttpResponse(null, { status: 404 }),
      ),
    );

    expect(await queryDocumentaryCheck()).to.equal(null);
  });

  it('should resolve to nothing when the check is not applicable', async () => {
    server.use(
      http.get(DOCUMENTARY_CHECK_URL, () =>
        HttpResponse.json({ applicable: false }),
      ),
    );

    expect(await queryDocumentaryCheck()).to.equal(null);
  });

  it('should request the given locale', async () => {
    const requestedLocales: Array<string | null> = [];

    server.use(
      http.get(DOCUMENTARY_CHECK_URL, ({ request }) => {
        requestedLocales.push(new URL(request.url).searchParams.get('locale'));
        return HttpResponse.json(DocumentaryCheckPublicResponseMock);
      }),
    );

    await queryDocumentaryCheck('pt-BR');

    expect(requestedLocales).to.deep.equal(['pt-BR']);
  });

  it('should cache per locale', () => {
    const toKey = (locale: 'en' | 'pt-BR') =>
      movieDocumentaryCheckQuery({
        slug: MovieHereticMappedMock.slug,
        locale,
        enabled: true,
      }).queryKey;

    expect(toKey('en')).to.not.deep.equal(toKey('pt-BR'));
  });

  it('should refetch when the VIP status changes', () => {
    const { queryKey } = movieDocumentaryCheckQuery({
      slug: MovieHereticMappedMock.slug,
      locale: 'en',
      enabled: true,
    });

    expect(queryKey).to.include(InvalidateAction.Vip.Updated);
  });
});
