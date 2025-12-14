import { MediaWatchingMappedMock } from '$mocks/data/summary/common/mapped/MediaWatchingMappedMock.ts';
import { EpisodeSiloResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { episodeWatchersQuery } from './episodeWatchersQuery.ts';

describe('episodeWatchersQuery', () => {
  it('should query for episode watchers', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          episodeWatchersQuery({
            slug: ShowSiloResponseMock.ids.slug,
            season: EpisodeSiloResponseMock.season,
            episode: EpisodeSiloResponseMock.number,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MediaWatchingMappedMock);
  });
});
