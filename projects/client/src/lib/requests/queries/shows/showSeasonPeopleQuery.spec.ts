import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { EpisodeSiloResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { ShowSiloSplitPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSplitPeopleMappedMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { showSeasonPeopleQuery } from './showSeasonPeopleQuery.ts';

describe('showSeasonPeopleQuery', () => {
  it('should query people for a season of Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          showSeasonPeopleQuery({
            slug: ShowSiloResponseMock.ids.slug,
            season: EpisodeSiloResponseMock.season,
            guestStars: true,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloSplitPeopleMappedMock);
  });

  it('should fetch split credits even when the old unsplit response is cached', async () => {
    const options = showSeasonPeopleQuery({
      slug: ShowSiloResponseMock.ids.slug,
      season: EpisodeSiloResponseMock.season,
      guestStars: true,
    });
    const result = await runQuery({
      factory: () => {
        // The previous key contained the query id, schema hash, slug and season.
        useQueryClient().setQueryData(
          options.queryKey.slice(0, 4),
          ShowSiloPeopleMappedMock,
        );
        return createTestBedQuery(options);
      },
      mapper: (response) => response?.data,
    });
    expect(result).to.deep.equal(ShowSiloSplitPeopleMappedMock);
  });
  it('should request the full cast without guest stars by default', async () => {
    const params = {
      slug: ShowSiloResponseMock.ids.slug,
      season: EpisodeSiloResponseMock.season,
    };
    const result = await runQuery({
      factory: () => createTestBedQuery(showSeasonPeopleQuery(params)),
      mapper: (response) => response?.data,
    });
    expect(result).to.deep.equal(ShowSiloPeopleMappedMock);
    expect(showSeasonPeopleQuery(params).queryKey).not.toEqual(
      showSeasonPeopleQuery({ ...params, guestStars: true }).queryKey,
    );
  });
});
