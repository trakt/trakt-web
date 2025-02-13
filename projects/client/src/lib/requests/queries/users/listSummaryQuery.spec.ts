import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { SiloListsMappedMock } from '$mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { listSummaryQuery } from './listSummaryQuery.ts';

describe('listSummaryQuery', () => {
  it('should query list summary', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          listSummaryQuery({
            userId: UserProfileHarryMappedMock.slug,
            listId: assertDefined(SiloListsMappedMock.at(0)).slug,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(SiloListsMappedMock.at(0));
  });
});
