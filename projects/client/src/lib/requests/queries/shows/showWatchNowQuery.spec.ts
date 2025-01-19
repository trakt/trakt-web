import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloWatchNowMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloWatchNowMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showWatchNowQuery } from './showWatchNowQuery.ts';

describe('showWatchNowQuery', () => {
  it('should query for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          showWatchNowQuery({ id: ShowSiloMappedMock.id, country: 'us' }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloWatchNowMappedMock);
  });
});
