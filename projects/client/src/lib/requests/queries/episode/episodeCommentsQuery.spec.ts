import { EpisodeSiloCommentsMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloCommentsMappedMock.ts';
import { EpisodeSiloResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { episodeCommentsQuery } from './episodeCommentsQuery.ts';

describe('episodeCommentsQuery', () => {
  it('should query for comments on an episode', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(episodeCommentsQuery({
          slug: ShowSiloMappedMock.slug,
          season: EpisodeSiloResponseMock.season,
          episode: EpisodeSiloResponseMock.number,
          limit: 10,
          sort: 'likes',
        })),
      mapper: (response) => {
        return response?.data;
      },
    });

    expect(result).to.deep.equal(EpisodeSiloCommentsMappedMock);
  });
});
