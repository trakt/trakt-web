import { EpisodeSiloCommentReactionsMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloCommentReactionsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { commentReactionsQuery } from './commentReactionsQuery.ts';

describe('commentReactionsQuery', () => {
  it('should query for comment reactions', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(commentReactionsQuery({
          id: 123,
        })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(EpisodeSiloCommentReactionsMappedMock);
  });
});
