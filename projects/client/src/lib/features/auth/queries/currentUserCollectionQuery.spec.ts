import { UserCollectionMappedMock } from '$mocks/data/users/mapped/UserCollectionMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { currentUserCollectionQuery } from './currentUserCollectionQuery.ts';

describe('currentUserCollectionQuery', () => {
  it('should query for collected movies', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          currentUserCollectionQuery({ type: 'movies', limit: 50 }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal([...UserCollectionMappedMock.movies]);
  });

  it('should query for collected episodes', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          currentUserCollectionQuery({ type: 'episodes', limit: 50 }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal([...UserCollectionMappedMock.episodes]);
  });
});
