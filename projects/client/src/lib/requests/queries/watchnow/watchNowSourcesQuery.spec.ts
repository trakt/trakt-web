import { WatchNowSourcesMappedMock } from '$mocks/data/watchnow/mapped/WatchNowSourcesMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { watchNowSourcesQuery } from './watchNowSourcesQuery.ts';

describe('watchNowSourcesQuery', () => {
  it('should query all watch now sources', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          watchNowSourcesQuery({}),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(WatchNowSourcesMappedMock);
  });
});
