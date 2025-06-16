import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { AllListedShowsMappedMock } from '$mocks/data/lists/mapped/AllListedShowsMappedMock.ts';
import { SiloListsMappedMock } from '$mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { userListAllShowItemsQuery } from './userListAllShowItemsQuery.ts';

describe('userListAllShowItemsQuery', () => {
  it('should query all show list items', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          userListAllShowItemsQuery({
            userId: assertDefined(UserProfileHarryMappedMock.slug),
            listId: assertDefined(SiloListsMappedMock.at(0)).slug,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(AllListedShowsMappedMock);
  });
});
