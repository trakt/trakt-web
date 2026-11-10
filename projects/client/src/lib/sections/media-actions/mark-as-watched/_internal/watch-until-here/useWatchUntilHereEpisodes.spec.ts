import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloSeasonEpisodesMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonEpisodesMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { combineLatest } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { useWatchUntilHereEpisodes } from './useWatchUntilHereEpisodes.ts';

const seasonOneEpisodes = ShowSiloSeasonEpisodesMappedMock;
const seasonTwoEpisodes = [1, 2, 3, 4].map((number) => ({
  ...ShowSiloSeasonEpisodesMappedMock[0],
  id: 9000 + number,
  season: 2,
  number,
}));

function toResult(props: Parameters<typeof useWatchUntilHereEpisodes>[0]) {
  const { episodes, isLoading } = useWatchUntilHereEpisodes(props);

  return combineLatest({ episodes, isLoading });
}

const baseProps = {
  showSlug: ShowSiloMappedMock.slug,
  previousSeasons: [],
  currentSeasonEpisodes: seasonTwoEpisodes,
  watchedBySeason: new Map<number, ReadonlySet<number>>(),
  targetEpisode: { season: 2, number: 3 },
  includesTarget: true,
};

describe('store: useWatchUntilHereEpisodes', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should include the target episode when asked to', async () => {
    const { episodes } = await runQuery({
      factory: () => toResult(baseProps),
    });

    expect(episodes.map((episode) => episode.number)).to.deep.equal([1, 2, 3]);
  });

  it('should stop before the target episode otherwise', async () => {
    const { episodes } = await runQuery({
      factory: () => toResult({ ...baseProps, includesTarget: false }),
    });

    expect(episodes.map((episode) => episode.number)).to.deep.equal([1, 2]);
  });

  it('should skip episodes that are already watched', async () => {
    const { episodes } = await runQuery({
      factory: () =>
        toResult({
          ...baseProps,
          watchedBySeason: new Map([[2, new Set([1, 3])]]),
        }),
    });

    expect(episodes.map((episode) => episode.number)).to.deep.equal([2]);
  });

  it('should sort the episodes of the current season', async () => {
    const { episodes } = await runQuery({
      factory: () =>
        toResult({
          ...baseProps,
          currentSeasonEpisodes: seasonTwoEpisodes.toReversed(),
        }),
    });

    expect(episodes.map((episode) => episode.number)).to.deep.equal([1, 2, 3]);
  });

  it('should prepend unwatched episodes of earlier seasons', async () => {
    const { episodes } = await runQuery({
      factory: () =>
        toResult({
          ...baseProps,
          previousSeasons: [{ number: 1 }],
          watchedBySeason: new Map([[1, new Set([1])]]),
        }),
      waitFor: ({ episodes: list }) => list.some((entry) => entry.season === 1),
    });

    const previous = episodes.filter((episode) => episode.season === 1);

    expect(previous).to.have.length(seasonOneEpisodes.length - 1);
    expect(previous.some((episode) => episode.number === 1)).to.equal(false);
    expect(episodes.at(-1)?.season).to.equal(2);
  });

  it('should ignore seasons that are not before the target', async () => {
    const { episodes } = await runQuery({
      factory: () =>
        toResult({
          ...baseProps,
          previousSeasons: [{ number: 2 }, { number: 3 }],
        }),
    });

    expect(episodes.every((episode) => episode.season === 2)).to.equal(true);
  });
});
