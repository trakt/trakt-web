import { UserBlockedMappedMock } from '$mocks/data/users/mapped/UserBlockedMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { blockedUsersQuery } from './blockedUsersQuery.ts';

describe('blockedUsersQuery', () => {
  it('should map the blocked users response to user profiles', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(blockedUsersQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserBlockedMappedMock);
  });
});
