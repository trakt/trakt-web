import { mapToMediaComment } from '$lib/requests/_internal/mapToMediaComment.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { MovieHereticCommentsResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticCommentsResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { commentQuery } from './commentQuery.ts';

describe('commentQuery', () => {
  it('should query for a comment by id', async () => {
    const commentResponse = assertDefined(
      MovieHereticCommentsResponseMock.at(0),
    );
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(commentQuery({ id: commentResponse.id })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(mapToMediaComment(commentResponse));
  });
});
