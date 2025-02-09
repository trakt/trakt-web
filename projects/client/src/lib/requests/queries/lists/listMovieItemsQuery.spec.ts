import { ListedMoviesMappedMock } from '$mocks/data/lists/mapped/ListedMoviesMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { listMovieItemsQuery } from './listMovieItemsQuery.ts';

describe('listMovieItemsQuery', () => {
  it('should query for movies on a list', async () => {
    const result = await runQuery({
      factory: () => createQuery(listMovieItemsQuery({ id: 1 })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ListedMoviesMappedMock);
  });
});
