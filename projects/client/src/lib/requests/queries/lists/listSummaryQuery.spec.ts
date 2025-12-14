import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { SiloListsMappedMock } from '$mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { listSummaryQuery } from './listSummaryQuery.ts';

describe('listSummaryQuery', () => {
  it('should query user list summary', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          listSummaryQuery({
            listId: `${assertDefined(SiloListsMappedMock.at(0)).id}`,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(SiloListsMappedMock.at(0));
  });
});
