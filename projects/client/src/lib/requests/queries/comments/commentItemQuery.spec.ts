import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { MovieHereticCommentsResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticCommentsResponseMock.ts';
import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { commentItemQuery } from './commentItemQuery.ts';

describe('commentItemQuery', () => {
  it('should map the attached movie to a direct comment target', async () => {
    const comment = assertDefined(MovieHereticCommentsResponseMock.at(0));
    const result = await runQuery({
      factory: () => createTestBedQuery(commentItemQuery({ id: comment.id })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal({
      type: 'movie',
      slug: MovieHereticResponseMock.ids.slug,
    });
  });
});
