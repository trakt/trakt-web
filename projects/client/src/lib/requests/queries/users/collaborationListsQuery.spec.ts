import { CollaborationListsMappedMock } from '$mocks/data/users/mapped/CollaborationListsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { collaborationListsQuery } from './collaborationListsQuery.ts';

describe('collaborationListsQuery', () => {
  it('should query list summary', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          collaborationListsQuery({ slug: 'me' }),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(CollaborationListsMappedMock);
  });
});
