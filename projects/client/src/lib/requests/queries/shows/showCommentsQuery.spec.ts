import { ShowSiloCommentsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloCommentsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showCommentsQuery } from './showCommentsQuery.ts';

describe('showCommentsQuery', () => {
  it('should query for comments on a show', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          showCommentsQuery({
            slug: ShowSiloMappedMock.slug,
            limit: 10,
            sort: 'likes',
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloCommentsMappedMock);
  });
});
