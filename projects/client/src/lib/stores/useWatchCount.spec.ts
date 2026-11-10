import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { useWatchCount } from './useWatchCount.ts';

const WATCHED_MOVIE_ID = 916302;
const SHOW_WITH_EPISODE_PLAYS_ID = 147971;

const watchedShow = {
  ...ShowSiloMappedMock,
  id: SHOW_WITH_EPISODE_PLAYS_ID,
  episode: { count: 8 },
};

describe('store: useWatchCount', () => {
  describe('when authorized', () => {
    beforeEach(() => {
      setAuthorization(true);
    });

    it('should count the plays of a watched movie', async () => {
      const result = await runQuery({
        factory: () =>
          useWatchCount({
            type: 'movie',
            media: { ...MovieHereticMappedMock, id: WATCHED_MOVIE_ID },
          }).watchCount,
        waitFor: (count) => count > 0,
      });

      expect(result).to.equal(1);
    });

    it('should be zero for a movie that was never watched', async () => {
      const result = await runQuery({
        factory: () =>
          useWatchCount({
            type: 'movie',
            media: { ...MovieHereticMappedMock, id: 1 },
          }).watchCount,
        waitFor: () => true,
      });

      expect(result).to.equal(0);
    });

    it('should use the minimum episode plays for a fully watched show', async () => {
      const result = await runQuery({
        factory: () =>
          useWatchCount({ type: 'show', media: watchedShow }).watchCount,
        waitFor: (count) => count > 0,
      });

      expect(result).to.equal(1);
    });

    it('should be zero for a show that is not fully watched', async () => {
      const partiallyWatched = {
        ...ShowSiloMappedMock,
        episode: { count: 15 },
      };

      const result = await runQuery({
        factory: () =>
          useWatchCount({ type: 'show', media: partiallyWatched }).watchCount,
        waitFor: () => true,
      });

      expect(result).to.equal(0);
    });

    it('should count the plays of a single episode', async () => {
      const result = await runQuery({
        factory: () =>
          useWatchCount({
            type: 'episode',
            show: { ...ShowSiloMappedMock, id: SHOW_WITH_EPISODE_PLAYS_ID },
            episode: { ...EpisodeSiloMappedMock, id: 2 },
          }).watchCount,
        waitFor: (count) => count > 0,
      });

      expect(result).to.equal(3);
    });

    it('should be zero for an episode that was never watched', async () => {
      const result = await runQuery({
        factory: () =>
          useWatchCount({
            type: 'episode',
            show: { ...ShowSiloMappedMock, id: SHOW_WITH_EPISODE_PLAYS_ID },
            episode: { ...EpisodeSiloMappedMock, id: 9999 },
          }).watchCount,
        waitFor: () => true,
      });

      expect(result).to.equal(0);
    });
  });

  describe('when unauthorized', () => {
    beforeEach(() => {
      setAuthorization(false);
    });

    it('should be zero', async () => {
      const result = await runQuery({
        factory: () =>
          useWatchCount({ type: 'show', media: watchedShow }).watchCount,
        waitFor: () => true,
      });

      expect(result).to.equal(0);
    });
  });
});
