import { MediaWatchingMappedMock } from '$mocks/data/summary/common/mapped/MediaWatchingMappedMock.ts';
import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { movieWatchersQuery } from './movieWatchersQuery.ts';

describe('movieWatchersQuery', () => {
  it('should query watchers for Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          movieWatchersQuery({ slug: MovieHereticResponseMock.ids.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MediaWatchingMappedMock);
  });
});
