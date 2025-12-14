import { PersonFergusonMappedMock } from '$mocks/data/people/mapped/PersonFergusonMappedMock.ts';
import { PersonFergusonResponseMock } from '$mocks/data/people/response/PersonFergusonResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { peopleSummaryQuery } from './peopleSummaryQuery.ts';

describe('peopleSummaryQuery', () => {
  it('should query for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          peopleSummaryQuery({ slug: PersonFergusonResponseMock.ids.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(PersonFergusonMappedMock);
  });
});
