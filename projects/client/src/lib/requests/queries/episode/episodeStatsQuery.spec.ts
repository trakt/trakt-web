import { EpisodeSiloStatsMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloStatsMappedMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { EpisodeSiloResponseMock } from '../../../../mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { episodeStatsQuery } from './episodeStatsQuery.ts';

describe('episodeStatsQuery', () => {
  it('should query for episode summary', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          episodeStatsQuery({
            slug: ShowSiloResponseMock.ids.slug,
            season: EpisodeSiloResponseMock.season,
            episode: EpisodeSiloResponseMock.number,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(EpisodeSiloStatsMappedMock);
  });
});
