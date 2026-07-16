import { smartListItemsQuery } from '$lib/requests/queries/smart-lists/smartListItemsQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { SmartListItemsMappedMock } from '$mocks/data/smart-lists/mapped/SmartListItemsMappedMock.ts';
import { SmartListDefinitionsMappedMock } from '$mocks/data/users/mapped/SmartListDefinitionsMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';

describe('smartListItemsQuery', () => {
  it('should request smart list items by slug', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          smartListItemsQuery({
            slug: assertDefined(SmartListDefinitionsMappedMock.at(0)).slug,
            limit: DEFAULT_PAGE_SIZE,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(SmartListItemsMappedMock);
  });
});
