import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { useWatchProgress } from './useWatchProgress.ts';

const WATCHED_SHOW_ID = 147971;

function showWithEpisodes(count: number, id = WATCHED_SHOW_ID) {
  return { ...ShowSiloMappedMock, id, episode: { count } };
}

describe('store: useWatchProgress', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should have no progress for movies', async () => {
    const result = await runQuery({
      factory: () =>
        useWatchProgress({ type: 'movie', media: MovieHereticMappedMock })
          .progress,
      waitFor: () => true,
    });

    expect(result).to.equal(undefined);
  });

  it('should be 100 for a fully watched show', async () => {
    const result = await runQuery({
      factory: () =>
        useWatchProgress({ type: 'show', media: showWithEpisodes(8) }).progress,
      waitFor: (progress) => progress === 100,
    });

    expect(result).to.equal(100);
  });

  it('should round down to the previous step of ten', async () => {
    const result = await runQuery({
      factory: () =>
        useWatchProgress({ type: 'show', media: showWithEpisodes(15) })
          .progress,
      waitFor: (progress) => progress !== 0,
    });

    expect(result).to.equal(50);
  });

  it('should never exceed 100 when more episodes are watched than known', async () => {
    const result = await runQuery({
      factory: () =>
        useWatchProgress({ type: 'show', media: showWithEpisodes(4) }).progress,
      waitFor: (progress) => progress !== 0,
    });

    expect(result).to.equal(100);
  });

  it('should be zero for a show without a known episode count', async () => {
    const result = await runQuery({
      factory: () =>
        useWatchProgress({ type: 'show', media: showWithEpisodes(0) }).progress,
      waitFor: () => true,
    });

    expect(result).to.equal(0);
  });

  it('should combine the progress of several shows', async () => {
    const result = await runQuery({
      factory: () =>
        useWatchProgress({
          type: 'show',
          media: [showWithEpisodes(8), showWithEpisodes(8, 1)],
        }).progress,
      waitFor: (progress) => progress !== 0,
    });

    expect(result).to.equal(50);
  });

  it('should be zero for an unauthorized user', async () => {
    setAuthorization(false);

    const result = await runQuery({
      factory: () =>
        useWatchProgress({ type: 'show', media: showWithEpisodes(8) }).progress,
      waitFor: () => true,
    });

    expect(result).to.equal(0);
  });
});
