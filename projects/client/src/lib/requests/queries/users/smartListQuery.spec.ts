import { getSmartListFilterSummary } from '$lib/sections/lists/smart/getSmartListFilterSummary.ts';
import {
  smartListQuery,
  SmartListSchema,
} from '$lib/requests/queries/users/smartListQuery.ts';
import { SmartListDefinitionsMappedMock } from '$mocks/data/users/mapped/SmartListDefinitionsMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';

describe('smartListQuery', () => {
  it('should retain parental ranges in saved lists and summarize their severities', () => {
    const list = SmartListSchema.parse({
      ...SmartListDefinitionsMappedMock.at(0),
      filters: { parental_nudity: [0, 0], parental_violence: [0, 1] },
    });

    expect(list.filters).toEqual({
      parental_nudity: [0, 0],
      parental_violence: [0, 1],
    });
    expect(getSmartListFilterSummary(list)).toContain(
      'Sex & Nudity: None to None',
    );
    expect(getSmartListFilterSummary(list)).toContain(
      'Violence & Gore: None to Mild',
    );
  });

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
