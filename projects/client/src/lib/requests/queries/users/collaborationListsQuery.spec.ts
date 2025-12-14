import { CollaborationListsMappedMock } from '$mocks/data/users/mapped/CollaborationListsMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { collaborationListsQuery } from './collaborationListsQuery.ts';

describe('collaborationListsQuery', () => {
  it('should query list summary', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          collaborationListsQuery({ slug: 'me' }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(CollaborationListsMappedMock);
  });
});
