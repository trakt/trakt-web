import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticPeopleMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticPeopleMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { moviePeopleQuery } from './moviePeopleQuery.ts';

describe('moviePeopleQuery', () => {
  it('should query people for Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          moviePeopleQuery({ slug: MovieHereticMappedMock.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticPeopleMappedMock);
  });

  it('should build movie portraits for the cast when the flag is on', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          moviePeopleQuery({
            slug: MovieHereticMappedMock.slug,
            portraits: true,
          }),
        ),
      waitFor: (response) => response.isSuccess,
    });

    expect(result.data?.cast.at(0)?.headshot.url.thumb).toContain(
      `/portraits/movie-${MovieHereticMappedMock.id}-`,
    );
  });
});
