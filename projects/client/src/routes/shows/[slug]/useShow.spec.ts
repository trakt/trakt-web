import QueryTestBed from '$test/beds/query/QueryTestBed.svelte';

import { setLocale } from '$lib/features/i18n/index.ts';
import { MediaWatchingMappedMock } from '$mocks/data/summary/common/mapped/MediaWatchingMappedMock.ts';
import { ShowSiloJapaneseMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloJapaneseMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { ShowSiloProgressMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloProgressMappedMock.ts';
import { ShowSiloRatingsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloRatingsMappedMock.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { ShowSiloStatsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloStatsMappedMock.ts';
import { ShowSiloStudiosMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloStudiosMappedMock.ts';
import { waitForQueryResult } from '$test/beds/query/waitForQueryResult.ts';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { useShow } from './useShow.ts';

describe('store: useShow', () => {
  describe('show: Silo (2023)', () => {
    it('should contain summary', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useShow(ShowSiloMappedMock.slug).show,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(ShowSiloMappedMock);
    });

    it('should contain english information', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useShow(ShowSiloMappedMock.slug).intl,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.include({
        'overview': ShowSiloMappedMock.overview,
        'tagline': ShowSiloMappedMock.tagline,
        'title': ShowSiloMappedMock.title,
      });
    });

    it('should contain japanese information', async () => {
      setLocale('ja-jp');

      render(QueryTestBed, {
        props: {
          queryFactory: () => useShow(ShowSiloMappedMock.slug).intl,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(ShowSiloJapaneseMappedMock);
    });

    it('should return ratings', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useShow(ShowSiloMappedMock.slug).ratings,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(ShowSiloRatingsMappedMock);
    });

    it('should return progress', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useShow(ShowSiloMappedMock.slug).progress,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(ShowSiloProgressMappedMock);
    });

    it('should return crew', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useShow(ShowSiloMappedMock.slug).crew,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(ShowSiloPeopleMappedMock);
    });

    it('should return seasons', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useShow(ShowSiloMappedMock.slug).seasons,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(ShowSiloSeasonsMappedMock);
    });

    it('should return studios', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useShow(ShowSiloMappedMock.slug).studios,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(ShowSiloStudiosMappedMock);
    });

    it('should return stats', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useShow(ShowSiloMappedMock.slug).stats,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(ShowSiloStatsMappedMock);
    });

    it('should return watching status', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useShow(ShowSiloMappedMock.slug).watchers,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(MediaWatchingMappedMock);
    });
  });
});
