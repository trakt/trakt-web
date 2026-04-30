import { UserFollowingMappedMock } from '$mocks/data/users/mapped/UserFollowingMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { currentUserPendingFollowsQuery } from './currentUserPendingFollowsQuery.ts';

describe('currentUserPendingFollowsQuery', () => {
  it('should query for outgoing pending follow requests', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(currentUserPendingFollowsQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserFollowingMappedMock);
  });
});
