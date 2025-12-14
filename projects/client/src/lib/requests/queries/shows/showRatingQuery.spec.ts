import { ShowSiloRatingsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloRatingsMappedMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { showRatingQuery } from './showRatingQuery.ts';

describe('showRatingQuery', () => {
  it('should query stats for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          showRatingQuery({ slug: ShowSiloResponseMock.ids.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloRatingsMappedMock);
  });
});
