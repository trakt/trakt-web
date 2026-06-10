import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { UserFollowingMappedMock } from '$mocks/data/users/mapped/UserFollowingMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { followingQuery } from './followingQuery.ts';

describe('followingQuery', () => {
  const slug = assertDefined(UserProfileHarryMappedMock.slug);

  it('should query for following', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          followingQuery({
            slug,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserFollowingMappedMock);
  });

  it('should invalidate when the user follow state changes', () => {
    const query = followingQuery({ slug });

    expect(query.queryKey).toContain(InvalidateAction.User.Follow);
  });
});
