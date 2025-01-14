import { ShowSiloPersonMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPersonMappedMock.js';
import { ShowSiloPersonResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloPersonResponseMock.js';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { peopleSummaryQuery } from './peopleSummaryQuery.js';

describe('peopleSummaryQuery', () => {
  it('should query for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          peopleSummaryQuery({ slug: ShowSiloPersonResponseMock.ids.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloPersonMappedMock);
  });
});
