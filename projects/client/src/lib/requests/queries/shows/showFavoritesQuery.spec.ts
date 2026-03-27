import { FavoritedShowsMappedMock } from '$mocks/data/users/mapped/FavoritedShowsMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { showFavoritesQuery } from './showFavoritesQuery.ts';

describe('showFavoritesQuery', () => {
  it('should query for favorited shows', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          showFavoritesQuery({ slug: 'me', limit: 10 }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(FavoritedShowsMappedMock);
  });
});
