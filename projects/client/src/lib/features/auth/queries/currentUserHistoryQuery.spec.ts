import { UserHistoryMappedMock } from '$mocks/data/users/mapped/UserHistoryMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { currentUserHistoryQuery } from './currentUserHistoryQuery.ts';

describe('currentUserHistoryQuery', () => {
  it('should query for user user history', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(currentUserHistoryQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserHistoryMappedMock);
  });
});
