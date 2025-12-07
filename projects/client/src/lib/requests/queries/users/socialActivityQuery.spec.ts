import { socialActivityQuery } from '$lib/requests/queries/users/socialActivityQuery.ts';
import { SocialActivityMappedMock } from '$mocks/data/users/mapped/SocialActivityMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { createInfiniteQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';

describe('socialActivityQuery', () => {
  it('should social activity', async () => {
    const result = await runQuery({
      factory: () =>
        createInfiniteQuery(
          socialActivityQuery(),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(SocialActivityMappedMock);
  });
});
