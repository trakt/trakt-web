import { setLocale } from '$lib/features/i18n/index.ts';
import { ShowSiloJapaneseMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloJapaneseMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
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

      expect(result).to.deep.equal(ShowSiloJapaneseMappedMock);
    });
  });
});
