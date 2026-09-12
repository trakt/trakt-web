import { EpisodeSiloPeopleMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloPeopleMappedMock.ts';
import { EpisodeSiloResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { episodePeopleQuery } from './episodePeopleQuery.ts';

describe('episodePeopleQuery', () => {
  it('should query people for a Silo (2023) episode', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          episodePeopleQuery({
            slug: ShowSiloResponseMock.ids.slug,
            season: EpisodeSiloResponseMock.season,
            guestStars: true,
            episode: EpisodeSiloResponseMock.number,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(EpisodeSiloPeopleMappedMock);
  });
  it('should request the full cast without guest stars by default', async () => {
    const params = {
      slug: ShowSiloResponseMock.ids.slug,
      season: EpisodeSiloResponseMock.season,
      episode: EpisodeSiloResponseMock.number,
    };
    const result = await runQuery({
      factory: () => createTestBedQuery(episodePeopleQuery(params)),
      mapper: (response) => response?.data,
    });
    expect(result).to.deep.equal({
      ...EpisodeSiloPeopleMappedMock,
      cast: [
        ...EpisodeSiloPeopleMappedMock.cast,
        ...EpisodeSiloPeopleMappedMock.guestStars,
      ],
      guestStars: [],
    });
    expect(episodePeopleQuery(params).queryKey).not.toEqual(
      episodePeopleQuery({ ...params, guestStars: true }).queryKey,
    );
  });
});
