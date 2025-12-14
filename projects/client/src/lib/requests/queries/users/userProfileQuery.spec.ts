import { userProfileQuery } from '$lib/requests/queries/users/userProfileQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { ExtendedUserProfileHarryMappedMock } from '$mocks/data/users/mapped/ExtendedUserProfileHarryMappedMock.ts';
import { ExtendedUserProfileHarryResponseMock } from '$mocks/data/users/response/ExtendedUserProfileHarryResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';

describe('userProfileQuery', () => {
  it('should query user profile', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          userProfileQuery({
            slug: assertDefined(ExtendedUserProfileHarryResponseMock.ids.slug),
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ExtendedUserProfileHarryMappedMock);
  });
});
