import { MediaWatchingMappedMock } from '$mocks/data/summary/common/mapped/MediaWatchingMappedMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showWatchersQuery } from './showWatchersQuery.ts';

describe('showWatchersQuery', () => {
  it('should query watchers for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          showWatchersQuery({ slug: ShowSiloResponseMock.ids.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MediaWatchingMappedMock);
  });
});
