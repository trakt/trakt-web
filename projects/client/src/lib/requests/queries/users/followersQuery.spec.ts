import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { UserFollowersMappedMock } from '$mocks/data/users/mapped/UserFollowersMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { followersQuery } from './followersQuery.ts';

describe('followersQuery', () => {
  const slug = assertDefined(UserProfileHarryMappedMock.slug);

  it('should query for followers', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          followersQuery({
            slug,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserFollowersMappedMock);
  });

  it('should invalidate when the user follow state changes', () => {
    const query = followersQuery({ slug });

    expect(query.queryKey).toContain(InvalidateAction.User.Follow);
  });
});
