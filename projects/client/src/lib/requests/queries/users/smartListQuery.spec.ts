import { smartListQuery } from '$lib/requests/queries/users/smartListQuery.ts';
import { MovieSmartListMappedMock } from '$mocks/data/users/mapped/MovieSmartListMappedMock.ts';
import { ShowSmartListMappedMock } from '$mocks/data/users/mapped/ShowSmartListMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';

describe('smartListQuery', () => {
  it('should request movie smart lists', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          smartListQuery({
            type: 'movie',
            limit: 10,
            page: 1,
          }),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(MovieSmartListMappedMock);
  });

  it('should request show smart lists', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          smartListQuery({
            type: 'show',
            limit: 10,
            page: 1,
          }),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(ShowSmartListMappedMock);
  });
});
