import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { UserFollowingMappedMock } from '$mocks/data/users/mapped/UserFollowingMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { followingQuery } from './followingQuery.ts';

describe('followingQuery', () => {
  it('should query for following', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          followingQuery({
            slug: assertDefined(UserProfileHarryMappedMock.slug),
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserFollowingMappedMock);
  });
});
