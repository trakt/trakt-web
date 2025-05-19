import { FavoritedShowsMappedMock } from '$mocks/data/users/mapped/FavoritedShowsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showFavoritesQuery } from './showFavoritesQuery.ts';

describe('showFavoritesQuery', () => {
  it('should query for favorited shows', async () => {
    const result = await runQuery({
      factory: () => createQuery(showFavoritesQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(FavoritedShowsMappedMock);
  });
});
