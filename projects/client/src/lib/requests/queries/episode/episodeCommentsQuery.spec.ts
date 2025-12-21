import { EpisodeSiloCommentsMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloCommentsMappedMock.ts';
import { EpisodeSiloResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { episodeCommentsQuery } from './episodeCommentsQuery.ts';

describe('episodeCommentsQuery', () => {
  it('should query for comments on an episode', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(episodeCommentsQuery({
          slug: ShowSiloMappedMock.slug,
          season: EpisodeSiloResponseMock.season,
          episode: EpisodeSiloResponseMock.number,
          limit: 10,
          sort: 'likes',
        })),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(EpisodeSiloCommentsMappedMock);
  });
});
