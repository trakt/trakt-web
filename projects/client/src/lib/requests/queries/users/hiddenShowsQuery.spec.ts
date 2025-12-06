import { HiddenShowProgressMappedMock } from '$mocks/data/users/mapped/HiddenShowProgressMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { createInfiniteQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { hiddenShowsQuery } from './hiddenShowsQuery.ts';

describe('hiddenShowQuery', () => {
  it('should query hidden items', async () => {
    const result = await runQuery({
      factory: () =>
        createInfiniteQuery(
          hiddenShowsQuery(),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(HiddenShowProgressMappedMock);
  });
});
