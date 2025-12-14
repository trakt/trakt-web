import { PersonGrantMovieCreditsMappedMock } from '$mocks/data/people/mapped/PersonGrantMovieCreditsMappedMock.ts';
import { PersonGrantResponseMock } from '$mocks/data/people/response/PersonGrantResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { personMovieCreditsQuery } from './personMovieCreditsQuery.ts';

describe('personMovieCreditsQuery', () => {
  it('should query for movie credits', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          personMovieCreditsQuery({
            slug: PersonGrantResponseMock.ids.slug,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(PersonGrantMovieCreditsMappedMock);
  });
});
