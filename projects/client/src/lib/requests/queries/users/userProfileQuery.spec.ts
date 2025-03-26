import { userProfileQuery } from '$lib/requests/queries/users/userProfileQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { ExtendedUserProfileHarryMappedMock } from '$mocks/data/users/mapped/ExtendedUserProfileHarryMappedMock.ts';
import { ExtendedUserProfileHarryResponseMock } from '$mocks/data/users/response/ExtendedUserProfileHarryResponseMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';

describe('userProfileQuery', () => {
  it('should query user profile', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          userProfileQuery({
            slug: assertDefined(ExtendedUserProfileHarryResponseMock.ids.slug),
          }),
        ),
      mapper: (response) => {
        console.log(response?.error);
        return response?.data;
      },
    });

    expect(result).to.deep.equal(ExtendedUserProfileHarryMappedMock);
  });
});
