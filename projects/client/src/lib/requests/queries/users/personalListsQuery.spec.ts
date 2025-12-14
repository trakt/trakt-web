import { PersonalListsMappedMock } from '$mocks/data/users/mapped/PersonalListsMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { personalListsQuery } from './personalListsQuery.ts';

describe('personalListsQuery', () => {
  it('should query list summary', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          personalListsQuery({ slug: 'me', limit: 10 }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(PersonalListsMappedMock);
  });
});
