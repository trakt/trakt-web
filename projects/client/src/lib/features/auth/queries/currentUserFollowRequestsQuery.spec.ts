import { UserFollowRequestsMappedMock } from '$mocks/data/users/mapped/UserFollowRequestsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { currentUserFollowRequestsQuery } from './currentUserFollowRequestsQuery.ts';

describe('currentUserFollowRequestsQuery', () => {
  it('should query for incoming follow requests', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(currentUserFollowRequestsQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserFollowRequestsMappedMock);
  });
});
