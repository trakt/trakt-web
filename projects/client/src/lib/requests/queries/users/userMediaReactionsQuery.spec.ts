import { userMediaReactionsQuery } from '$lib/requests/queries/users/userMediaReactionsQuery.ts';
import { MovieHereticUserReactionsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticUserReactionsMappedMock.ts';
import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';

describe('userMediaReactionsQuery', () => {
  it('should drop reactions outside the media taxonomy', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          userMediaReactionsQuery({
            type: 'movie',
            id: MovieHereticResponseMock.ids.trakt,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticUserReactionsMappedMock);
  });
});
