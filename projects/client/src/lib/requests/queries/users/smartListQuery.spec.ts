import { smartListQuery } from '$lib/requests/queries/users/smartListQuery.ts';
import { SmartListDefinitionsMappedMock } from '$mocks/data/users/mapped/SmartListDefinitionsMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';

describe('smartListQuery', () => {
  it('should request smart lists', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          smartListQuery({}),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(SmartListDefinitionsMappedMock);
  });
});
