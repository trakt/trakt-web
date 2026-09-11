import { GifCategoriesMappedMock } from '$mocks/data/gifs/mapped/GifCategoriesMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { gifCategoriesQuery } from './gifCategoriesQuery.ts';

describe('gifCategoriesQuery', () => {
  it('should query for the gif categories', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(gifCategoriesQuery({ customerId: 'test-device' })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(GifCategoriesMappedMock);
  });
});
