import { setLocale } from '$lib/features/i18n/index.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { ShowSiloStudiosMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloStudiosMappedMock.ts';
import { ShowSiloTranslationsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloTranslationsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { useShow } from './useShow.ts';

describe('store: useShow', () => {
  describe('show: Silo (2023)', () => {
    it('should contain summary', async () => {
      const result = await runQuery({
        factory: () => useShow(ShowSiloMappedMock.slug).show,
      });

      expect(result).to.deep.equal(ShowSiloMappedMock);
    });

    it('should contain english information', async () => {
      const result = await runQuery({
        factory: () => useShow(ShowSiloMappedMock.slug).intl,
      });

      expect(result).to.include({
        'overview': ShowSiloMappedMock.overview,
        'tagline': ShowSiloMappedMock.tagline,
        'title': ShowSiloMappedMock.title,
      });
    });

    it('should contain japanese information', async () => {
      setLocale('ja-jp');

      const result = await runQuery({
        factory: () => useShow(ShowSiloMappedMock.slug).intl,
      });

      expect(result).to.deep.equal(ShowSiloTranslationsMappedMock.get('ja'));
    });

    it('should return crew', async () => {
      const result = await runQuery({
        factory: () => useShow(ShowSiloMappedMock.slug).crew,
      });

      expect(result).to.deep.equal(ShowSiloPeopleMappedMock);
    });

    it('should return seasons', async () => {
      const result = await runQuery({
        factory: () => useShow(ShowSiloMappedMock.slug).seasons,
      });

      expect(result).to.deep.equal(ShowSiloSeasonsMappedMock);
    });

    it('should return studios', async () => {
      const result = await runQuery({
        factory: () => useShow(ShowSiloMappedMock.slug).studios,
      });

      expect(result).to.deep.equal(ShowSiloStudiosMappedMock);
    });
  });
});
