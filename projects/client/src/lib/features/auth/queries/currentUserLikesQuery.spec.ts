import { UserLikesMappedMock } from '$mocks/data/users/mapped/UserLikesMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { currentUserLikesQuery } from './currentUserLikesQuery.ts';

describe('currentUserLikesQuery', () => {
  it('should query for a users likes', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(currentUserLikesQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserLikesMappedMock);
  });
});
