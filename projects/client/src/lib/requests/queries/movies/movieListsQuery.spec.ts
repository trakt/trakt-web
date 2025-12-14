import { OfficialListsMappedMock } from '$mocks/data/lists/mapped/OfficialListsMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { HereticListsMappedMock } from '../../../../mocks/data/summary/movies/heretic/mapped/HereticListsMappedMock.ts';
import { movieListsQuery } from './movieListsQuery.ts';

describe('movieListsQuery', () => {
  it('should query for lists that contain Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          movieListsQuery({ slug: MovieHereticMappedMock.slug, limit: 10 }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(HereticListsMappedMock);
  });

  it('should query for official lists that contain Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          movieListsQuery({
            slug: MovieHereticMappedMock.slug,
            limit: 10,
            type: 'official',
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(OfficialListsMappedMock);
  });
});
