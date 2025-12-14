import { EpisodeSiloRatingsMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloRatingsMappedMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { EpisodeSiloResponseMock } from '../../../../mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { episodeRatingQuery } from './episodeRatingQuery.ts';

describe('episodeRatingQuery', () => {
  it('should query for episode summary', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          episodeRatingQuery({
            slug: ShowSiloResponseMock.ids.slug,
            season: EpisodeSiloResponseMock.season,
            episode: EpisodeSiloResponseMock.number,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(EpisodeSiloRatingsMappedMock);
  });
});
