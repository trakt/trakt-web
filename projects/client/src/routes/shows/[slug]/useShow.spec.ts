import { setLocale } from '$lib/features/i18n/index.ts';
import { valueObservable } from '$test/beds/store/valueObservable.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { ShowSiloStudiosMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloStudiosMappedMock.ts';
import { ShowSiloTranslationsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloTranslationsMappedMock.ts';
import { DocumentaryCheckPublicMappedMock } from '$mocks/data/summary/documentary-check/mapped/DocumentaryCheckPublicMappedMock.ts';
import { DocumentaryCheckPublicResponseMock } from '$mocks/data/summary/documentary-check/response/DocumentaryCheckPublicResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { server } from '$mocks/server.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { useShow } from './useShow.ts';

describe('store: useShow', () => {
  describe('show: Silo (2023)', () => {
    it('should contain summary', async () => {
      const result = await runQuery({
        factory: () => useShow(valueObservable(ShowSiloMappedMock.slug)).show,
      });

      expect(result).to.deep.equal(ShowSiloMappedMock);
    });

    it('should contain english information', async () => {
      const result = await runQuery({
        factory: () => useShow(valueObservable(ShowSiloMappedMock.slug)).intl,
        waitFor: (result) => result?.overview !== '',
      });

      expect(result).to.include({
        overview: ShowSiloMappedMock.overview,
        tagline: ShowSiloMappedMock.tagline,
        title: ShowSiloMappedMock.title,
      });
    });

    it('should contain japanese information', async () => {
      setLocale('ja-JP');

      const result = await runQuery({
        factory: () => useShow(valueObservable(ShowSiloMappedMock.slug)).intl,
        waitFor: (result) => result?.overview !== '' && result?.country !== '',
      });

      const { language: _language, ...expected } =
        ShowSiloTranslationsMappedMock.get('ja')!;
      expect(result).to.deep.equal(expected);
    });

    it('should return crew', async () => {
      const result = await runQuery({
        factory: () => useShow(valueObservable(ShowSiloMappedMock.slug)).crew,
        waitFor: (result) => result.cast.length !== 0,
      });

      expect(result).to.deep.equal(ShowSiloPeopleMappedMock);
    });

    it('should return seasons', async () => {
      const result = await runQuery({
        factory: () =>
          useShow(valueObservable(ShowSiloMappedMock.slug)).seasons,
      });

      expect(result).to.deep.equal(ShowSiloSeasonsMappedMock);
    });

    it('should finish loading while sentiment is still pending', async () => {
      setAuthorization(true);
      server.use(
        http.get(
          `http://localhost/v3/media/show/${ShowSiloMappedMock.slug}/info/0/version/2`,
          () => delay('infinite'),
        ),
      );

      const result = await runQuery({
        factory: () =>
          useShow(valueObservable(ShowSiloMappedMock.slug)).isLoading,
        waitFor: (isLoading) => !isLoading,
      });

      expect(result).to.equal(false);
    });

    it('should show the documentary check for a documentary', async () => {
      setAuthorization(true);
      server.use(
        http.get(`http://localhost/shows/${ShowSiloMappedMock.slug}`, () =>
          HttpResponse.json({
            ...ShowSiloResponseMock,
            genres: ['documentary'],
          }),
        ),
        http.get(
          `http://localhost/v3/media/show/${ShowSiloMappedMock.slug}/info/66/version/1`,
          () => HttpResponse.json(DocumentaryCheckPublicResponseMock),
        ),
      );

      const result = await runQuery({
        factory: () =>
          useShow(valueObservable(ShowSiloMappedMock.slug)).realityCheck,
        waitFor: (realityCheck) => realityCheck !== undefined,
      });

      expect(result).to.deep.equal(DocumentaryCheckPublicMappedMock);
    });

    it('should not request a documentary check for another genre', async () => {
      setAuthorization(true);
      const requested = vi.fn();
      server.use(
        http.get(
          `http://localhost/v3/media/show/${ShowSiloMappedMock.slug}/info/66/version/1`,
          () => {
            requested();
            return HttpResponse.json(DocumentaryCheckPublicResponseMock);
          },
        ),
      );

      const result = await runQuery({
        factory: () =>
          useShow(valueObservable(ShowSiloMappedMock.slug)).realityCheck,
        waitFor: (realityCheck) => realityCheck !== undefined,
      });

      expect(result).to.not.deep.equal(DocumentaryCheckPublicMappedMock);
      expect(requested).not.toHaveBeenCalled();
    });

    it('should return studios', async () => {
      const result = await runQuery({
        factory: () =>
          useShow(valueObservable(ShowSiloMappedMock.slug)).studios,
        waitFor: (result) => result.length !== 0,
      });

      expect(result).to.deep.equal(ShowSiloStudiosMappedMock);
    });
  });
});
