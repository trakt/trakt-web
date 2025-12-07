import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { EpisodeSiloCommentReplyMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloCommentReplyMappedMock.ts';
import { EpisodeSiloCommentsMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloCommentsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { createInfiniteQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { commentRepliesQuery } from './commentRepliesQuery.ts';

describe('commentRepliesQuery', () => {
  it('should query for comment replies', async () => {
    const result = await runQuery({
      factory: () =>
        createInfiniteQuery(commentRepliesQuery({
          id: assertDefined(EpisodeSiloCommentsMappedMock.at(0)).id,
          limit: 10,
        })),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(EpisodeSiloCommentReplyMappedMock);
  });
});
