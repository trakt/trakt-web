import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { UserFollowersMappedMock } from '$mocks/data/users/mapped/UserFollowersMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { followersQuery } from './followersQuery.ts';

describe('followersQuery', () => {
  it('should query for followers', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          followersQuery({
            slug: assertDefined(UserProfileHarryMappedMock.slug),
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserFollowersMappedMock);
  });
});
