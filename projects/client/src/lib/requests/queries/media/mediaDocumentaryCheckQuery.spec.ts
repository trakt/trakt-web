import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { DocumentaryCheckPublicMappedMock } from '$mocks/data/summary/documentary-check/mapped/DocumentaryCheckPublicMappedMock.ts';
import { DocumentaryCheckVipMappedMock } from '$mocks/data/summary/documentary-check/mapped/DocumentaryCheckVipMappedMock.ts';
import { DocumentaryCheckPublicResponseMock } from '$mocks/data/summary/documentary-check/response/DocumentaryCheckPublicResponseMock.ts';
import { DocumentaryCheckVipResponseMock } from '$mocks/data/summary/documentary-check/response/DocumentaryCheckVipResponseMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { mediaDocumentaryCheckQuery } from './mediaDocumentaryCheckQuery.ts';

describe.each<{ type: MediaType; slug: string }>([
  { type: 'movie', slug: MovieHereticMappedMock.slug },
  { type: 'show', slug: ShowSiloMappedMock.slug },
])('mediaDocumentaryCheckQuery ($type)', ({ type, slug }) => {
  const DOCUMENTARY_CHECK_URL = `http://localhost/v3/media/${type}/${slug}/info/66/version/1`;

  const toQuery = (locale: 'en' | 'pt-BR' = 'en') =>
    mediaDocumentaryCheckQuery({ type, slug, locale, enabled: true });

  const queryDocumentaryCheck = (locale: 'en' | 'pt-BR' = 'en') =>
    runQuery({
      factory: () => createTestBedQuery(toQuery(locale)),
      waitFor: (data) => data !== undefined,
      mapper: (response) => response?.data,
    });

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
    expect(toQuery('en').queryKey).to.not.deep.equal(toQuery('pt-BR').queryKey);
  });

  it('should refetch when the VIP status changes', () => {
    expect(toQuery().queryKey).to.include(InvalidateAction.Vip.Updated);
  });
});

describe('mediaDocumentaryCheckQuery', () => {
  it('should cache per media type', () => {
    const toKey = (type: MediaType) =>
      mediaDocumentaryCheckQuery({
        type,
        slug: 'same-slug',
        locale: 'en',
        enabled: true,
      }).queryKey;

    expect(toKey('movie')).to.not.deep.equal(toKey('show'));
  });
});
