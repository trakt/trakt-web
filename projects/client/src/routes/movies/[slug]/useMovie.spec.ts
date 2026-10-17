import { setLocale } from '$lib/features/i18n/index.ts';
import { valueObservable } from '$test/beds/store/valueObservable.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticPeopleMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticPeopleMappedMock.ts';
import { MovieHereticStudiosMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticStudiosMappedMock.ts';
import { MovieHereticTranslationsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticTranslationsMappedMock.ts';
import { server } from '$mocks/server.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { delay, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { useMovie } from './useMovie.ts';

describe('store: useMovie', () => {
  describe('movie: Heretic (2024)', () => {
    it('should contain summary', async () => {
      const result = await runQuery({
        factory: () =>
          useMovie(valueObservable(MovieHereticMappedMock.slug)).movie,
      });

      expect(result).to.deep.equal(MovieHereticMappedMock);
    });

    it('should contain english information', async () => {
      const result = await runQuery({
        factory: () =>
          useMovie(valueObservable(MovieHereticMappedMock.slug)).intl,
        waitFor: (result) => result?.overview !== '',
      });

      expect(result).to.include({
        overview: MovieHereticMappedMock.overview,
        tagline: MovieHereticMappedMock.tagline,
        title: MovieHereticMappedMock.title,
      });
    });

    it('should contain portuguese information', async () => {
      setLocale('pt-BR');

      const result = await runQuery({
        factory: () =>
          useMovie(valueObservable(MovieHereticMappedMock.slug)).intl,
        waitFor: (result) => result?.overview !== '' && result?.country !== '',
      });

      const { language: _language, ...expected } =
        MovieHereticTranslationsMappedMock.get('pt')!;
      expect(result).to.deep.equal(expected);
    });

    it('should finish loading while videos are still pending', async () => {
      server.use(
        http.get(
          `http://localhost/movies/${MovieHereticMappedMock.slug}/videos`,
          () => delay('infinite'),
        ),
      );

      const result = await runQuery({
        factory: () =>
          useMovie(valueObservable(MovieHereticMappedMock.slug)).isLoading,
        waitFor: (isLoading) => !isLoading,
      });

      expect(result).to.equal(false);
    });

    it('should finish loading while sentiment is still pending', async () => {
      setAuthorization(true);
      server.use(
        http.get(
          `http://localhost/v3/media/movie/${MovieHereticMappedMock.slug}/info/0/version/2`,
          () => delay('infinite'),
        ),
      );

      const result = await runQuery({
        factory: () =>
          useMovie(valueObservable(MovieHereticMappedMock.slug)).isLoading,
        waitFor: (isLoading) => !isLoading,
      });

      expect(result).to.equal(false);
    });

    it('should return studios', async () => {
      const result = await runQuery({
        factory: () =>
          useMovie(valueObservable(MovieHereticMappedMock.slug)).studios,
        waitFor: (result) => result.length !== 0,
      });

      expect(result).to.deep.equal(MovieHereticStudiosMappedMock);
    });

    it('should return crew', async () => {
      const result = await runQuery({
        factory: () =>
          useMovie(valueObservable(MovieHereticMappedMock.slug)).crew,
        waitFor: (result) => result.cast.length !== 0,
      });

      expect(result).to.deep.equal(MovieHereticPeopleMappedMock);
    });
  });
});
