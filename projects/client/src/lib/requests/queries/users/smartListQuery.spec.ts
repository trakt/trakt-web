import { smartListQuery } from '$lib/requests/queries/users/smartListQuery.ts';
import { MovieSmartListMappedMock } from '$mocks/data/users/mapped/MovieSmartListMappedMock.ts';
import { ShowSmartListMappedMock } from '$mocks/data/users/mapped/ShowSmartListMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { createInfiniteQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';

describe('smartListQuery', () => {
  it('should request movie smart lists', async () => {
    const result = await runQuery({
      factory: () =>
        createInfiniteQuery(
          smartListQuery({
            type: 'movie',
            limit: 10,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(MovieSmartListMappedMock);
  });

  it('should request show smart lists', async () => {
    const result = await runQuery({
      factory: () =>
        createInfiniteQuery(
          smartListQuery({
            type: 'show',
            limit: 10,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(ShowSmartListMappedMock);
  });
});
