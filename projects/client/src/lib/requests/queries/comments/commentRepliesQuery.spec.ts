import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { EpisodeSiloCommentReplyMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloCommentReplyMappedMock.ts';
import { EpisodeSiloCommentsMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloCommentsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { commentRepliesQuery } from './commentRepliesQuery.ts';

describe('commentRepliesQuery', () => {
  it('should query for comment replies', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(commentRepliesQuery({
          id: assertDefined(EpisodeSiloCommentsMappedMock.at(0)).id,
          limit: 10,
          page: 1,
        })),
      mapper: (response) => {
        return response?.data?.entries;
      },
    });

    expect(result).to.deep.equal(EpisodeSiloCommentReplyMappedMock);
  });
});
