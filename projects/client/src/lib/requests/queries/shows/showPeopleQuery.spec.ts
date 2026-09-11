import { ShowSiloSplitPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSplitPeopleMappedMock.ts';
import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { showPeopleQuery } from './showPeopleQuery.ts';

describe('showPeopleQuery', () => {
  it('should query people for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          showPeopleQuery({ slug: ShowSiloResponseMock.ids.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloPeopleMappedMock);
  });
  it('should request split credits separately for the people drawer', async () => {
    const params = { slug: ShowSiloResponseMock.ids.slug };
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(showPeopleQuery({ ...params, guestStars: true })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloSplitPeopleMappedMock);
    expect(showPeopleQuery(params).queryKey).not.toEqual(
      showPeopleQuery({ ...params, guestStars: true }).queryKey,
    );
  });
});
