import { CollaborationListsMappedMock } from '$mocks/data/users/mapped/CollaborationListsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { collaborationListsQuery } from './collaborationListsQuery.ts';

describe('collaborationListsQuery', () => {
  it('should query list summary', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          collaborationListsQuery({ slug: 'me' }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(CollaborationListsMappedMock);
  });
});
