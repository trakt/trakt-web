import { ListedShowsMappedMock } from '$mocks/data/lists/mapped/ListedShowsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { listShowItemsQuery } from './listShowItemsQuery.ts';

describe('listShowItemsQuery', () => {
  it('should query for shows on a list', async () => {
    const result = await runQuery({
      factory: () => createQuery(listShowItemsQuery({ id: 1 })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ListedShowsMappedMock);
  });
});
