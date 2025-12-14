import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { SiloListsMappedMock } from '$mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { userListSummaryQuery } from './userListSummaryQuery.ts';

describe('userListSummaryQuery', () => {
  it('should query user list summary', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          userListSummaryQuery({
            userId: assertDefined(UserProfileHarryMappedMock.slug),
            listId: assertDefined(SiloListsMappedMock.at(0)).slug,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(SiloListsMappedMock.at(0));
  });
});
