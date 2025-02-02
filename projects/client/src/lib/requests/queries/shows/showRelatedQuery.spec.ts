import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloRelatedMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloRelatedMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showRelatedQuery } from './showRelatedQuery.ts';

describe('showRelatedQuery', () => {
  it('should query related for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(showRelatedQuery({ slug: ShowSiloMappedMock.slug })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloRelatedMappedMock);
  });
});
