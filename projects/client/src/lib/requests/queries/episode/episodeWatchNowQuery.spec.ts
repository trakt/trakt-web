import { EpisodeSiloWatchNowMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloWatchNowMappedMock.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { episodeWatchNowQuery } from './episodeWatchNowQuery.ts';

describe('episodeWatchNowQuery', () => {
  it('should query for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          episodeWatchNowQuery({ id: EpisodeSiloMappedMock.id, country: 'us' }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(EpisodeSiloWatchNowMappedMock);
  });
});
