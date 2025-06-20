import { ShowsHotMappedMock } from '$mocks/data/shows/mapped/ShowsHotMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showHotQuery } from './showHotQuery.ts';

describe('showHotQuery', () => {
  it('should query for hot shows', async () => {
    const result = await runQuery({
      factory: () => createQuery(showHotQuery()),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(ShowsHotMappedMock);
  });
});
