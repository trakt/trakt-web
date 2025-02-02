import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showPeopleQuery } from './showPeopleQuery.ts';

describe('showPeopleQuery', () => {
  it('should query people for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          showPeopleQuery({ slug: ShowSiloResponseMock.ids.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloPeopleMappedMock);
  });
});
