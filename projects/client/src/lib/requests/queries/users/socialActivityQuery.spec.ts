import { socialActivityQuery } from '$lib/requests/queries/users/socialActivityQuery.ts';
import { SocialActivityMappedMock } from '$mocks/data/users/mapped/SocialActivityMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';

describe('socialActivityQuery', () => {
  it('should social activity', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          socialActivityQuery(),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(SocialActivityMappedMock);
  });
});
