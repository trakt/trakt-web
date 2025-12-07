import { HiddenShowProgressMappedMock } from '$mocks/data/users/mapped/HiddenShowProgressMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { hiddenShowsQuery } from './hiddenShowsQuery.ts';

describe('hiddenShowQuery', () => {
  it('should query hidden items', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          hiddenShowsQuery(),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(HiddenShowProgressMappedMock);
  });
});
