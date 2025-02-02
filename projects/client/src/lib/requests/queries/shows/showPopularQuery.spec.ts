import { ShowsPopularMappedMock } from '$mocks/data/shows/mapped/ShowsPopularMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showPopularQuery } from './showPopularQuery.ts';

describe('showPopularQuery', () => {
  it('should query for popular shows', async () => {
    const result = await runQuery({
      factory: () => createQuery(showPopularQuery()),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(ShowsPopularMappedMock);
  });
});
