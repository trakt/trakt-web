import { ShowsStreamingMappedMock } from '$mocks/data/shows/mapped/ShowsStreamingMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showStreamingQuery } from './showStreamingQuery.ts';

describe('showStreamingQuery', () => {
  it('should query for trending streaming shows', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          showStreamingQuery(),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(ShowsStreamingMappedMock);
  });
});
