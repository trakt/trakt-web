import { ShowSiloCommentsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloCommentsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { showCommentsQuery } from './showCommentsQuery.ts';

describe('showCommentsQuery', () => {
  it('should query for comments on a show', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          showCommentsQuery({
            slug: ShowSiloMappedMock.slug,
            limit: 10,
            sort: 'likes',
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(ShowSiloCommentsMappedMock);
  });
});
