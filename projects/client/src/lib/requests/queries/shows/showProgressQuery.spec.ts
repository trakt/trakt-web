import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloProgressMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloProgressMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showProgressQuery } from './showProgressQuery.ts';

describe('showProgressQuery', () => {
  it('should query progress for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(showProgressQuery({ slug: ShowSiloMappedMock.slug })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloProgressMappedMock);
  });
});
