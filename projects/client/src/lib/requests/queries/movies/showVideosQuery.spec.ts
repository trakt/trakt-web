import { ShowSiloVideoMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloVideoMappedMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showVideosQuery } from './showVideosQuery.ts';

describe('showVideosQuery', () => {
  it('should query videos for Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          showVideosQuery({
            slug: ShowSiloResponseMock.ids.slug,
            seasons: [1, 2],
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.have.deep.members(ShowSiloVideoMappedMock);
  });
});
