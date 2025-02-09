import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { SiloListsMappedMock } from '../../../../mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { showListsQuery } from './showListsQuery.ts';

describe('showListsQuery', () => {
  it('should query for lists that contain Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          showListsQuery({ slug: ShowSiloMappedMock.slug, limit: 10 }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(SiloListsMappedMock);
  });
});
