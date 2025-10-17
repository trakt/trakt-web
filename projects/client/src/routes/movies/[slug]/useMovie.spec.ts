import { setLocale } from '$lib/features/i18n/index.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticPeopleMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticPeopleMappedMock.ts';
import { MovieHereticStudiosMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticStudiosMappedMock.ts';
import { MovieHereticTranslationsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticTranslationsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { useMovie } from './useMovie.ts';

describe('store: useMovie', () => {
  describe('movie: Heretic (2024)', () => {
    it('should contain summary', async () => {
      const result = await runQuery({
        factory: () => useMovie(MovieHereticMappedMock.slug).movie,
      });

      expect(result).to.deep.equal(MovieHereticMappedMock);
    });

    it('should contain english information', async () => {
      const result = await runQuery({
        factory: () => useMovie(MovieHereticMappedMock.slug).intl,
      });

      expect(result).to.include({
        overview: MovieHereticMappedMock.overview,
        tagline: MovieHereticMappedMock.tagline,
        title: MovieHereticMappedMock.title,
      });
    });

    it('should contain portuguese information', async () => {
      setLocale('pt-br');

      const result = await runQuery({
        factory: () => useMovie(MovieHereticMappedMock.slug).intl,
      });

      expect(result).to.deep.equal(
        MovieHereticTranslationsMappedMock.get('pt'),
      );
    });

    it('should return studios', async () => {
      const result = await runQuery({
        factory: () => useMovie(MovieHereticMappedMock.slug).studios,
      });

      expect(result).to.deep.equal(MovieHereticStudiosMappedMock);
    });

    it('should return crew', async () => {
      const result = await runQuery({
        factory: () => useMovie(MovieHereticMappedMock.slug).crew,
      });

      expect(result).to.deep.equal(MovieHereticPeopleMappedMock);
    });
  });
});
