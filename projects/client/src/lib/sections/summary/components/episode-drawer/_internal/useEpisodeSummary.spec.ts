import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { EpisodeSiloResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { valueObservable } from '$test/beds/store/valueObservable.ts';
import { describe, expect, it } from 'vitest';
import { useEpisodeSummary } from './useEpisodeSummary.ts';

describe('store: useEpisodeSummary', () => {
  it('should fetch the episode summary', async () => {
    const result = await runQuery({
      factory: () =>
        useEpisodeSummary(
          valueObservable({
            slug: ShowSiloResponseMock.ids.slug,
            season: EpisodeSiloResponseMock.season,
            episode: EpisodeSiloResponseMock.number,
          }),
        ).episode,
      waitFor: (value) => value != null,
    });

    expect(result).to.deep.equal(EpisodeSiloMappedMock);
  });
});
