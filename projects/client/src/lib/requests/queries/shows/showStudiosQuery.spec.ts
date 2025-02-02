import { ShowSiloStudiosMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloStudiosMappedMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showStudiosQuery } from './showStudiosQuery.ts';

describe('showStudiosQuery', () => {
  it('should query studios for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          showStudiosQuery({ slug: ShowSiloResponseMock.ids.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloStudiosMappedMock);
  });
});
