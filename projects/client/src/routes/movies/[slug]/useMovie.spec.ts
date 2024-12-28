import QueryTestBed from '$test/beds/query/QueryTestBed.svelte';

import { setLocale } from '$lib/features/i18n/index.ts';
import { MediaWatchingMappedMock } from '$mocks/data/summary/common/mapped/MediaWatchingMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticPeopleMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticPeopleMappedMock.ts';
import { MovieHereticPortugueseMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticPortugueseMappedMock.ts';
import { MovieHereticRatingsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticRatingsMappedMock.ts';
import { MovieHereticStatsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticStatsMappedMock.ts';
import { MovieStudiosMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieStudiosMappedMock.ts';
import { waitForQueryResult } from '$test/beds/query/waitForQueryResult.ts';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { useMovie } from './useMovie.ts';

describe('store: useMovie', () => {
  describe('movie: Heretic (2024)', () => {
    it('should contain summary', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useMovie(MovieHereticMappedMock.slug).movie,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(MovieHereticMappedMock);
    });

    it('should contain english information', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useMovie(MovieHereticMappedMock.slug).intl,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.include({
        'overview': MovieHereticMappedMock.overview,
        'tagline': MovieHereticMappedMock.tagline,
        'title': MovieHereticMappedMock.title,
      });
    });

    it('should contain portuguese information', async () => {
      setLocale('pt-br');

      render(QueryTestBed, {
        props: {
          queryFactory: () => useMovie(MovieHereticMappedMock.slug).intl,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(MovieHereticPortugueseMappedMock);
    });

    it('should return ratings', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useMovie(MovieHereticMappedMock.slug).ratings,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(MovieHereticRatingsMappedMock);
    });

    it('should return stats', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useMovie(MovieHereticMappedMock.slug).stats,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(MovieHereticStatsMappedMock);
    });

    it('should return watching status', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useMovie(MovieHereticMappedMock.slug).watchers,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(MediaWatchingMappedMock);
    });

    it('should return studios', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useMovie(MovieHereticMappedMock.slug).studios,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(MovieStudiosMappedMock);
    });

    it('should return crew', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useMovie(MovieHereticMappedMock.slug).crew,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(MovieHereticPeopleMappedMock);
    });
  });
});
