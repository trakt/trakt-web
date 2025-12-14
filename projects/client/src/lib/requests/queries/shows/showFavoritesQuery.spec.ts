import { FavoritedShowsMappedMock } from '$mocks/data/users/mapped/FavoritedShowsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { showFavoritesQuery } from './showFavoritesQuery.ts';

describe('showFavoritesQuery', () => {
  it('should query for favorited shows', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(showFavoritesQuery({ slug: 'me' })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(FavoritedShowsMappedMock);
  });
});
