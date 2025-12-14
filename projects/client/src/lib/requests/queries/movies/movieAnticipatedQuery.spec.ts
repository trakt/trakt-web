import { MoviesAnticipatedMappedMock } from '$mocks/data/movies/mapped/MoviesAnticipatedMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { movieAnticipatedQuery } from './movieAnticipatedQuery.ts';

describe('movieAnticipatedQuery', () => {
  it('should query for anticipated movies', async () => {
    const result = await runQuery({
      factory: () => createTestBedInfiniteQuery(movieAnticipatedQuery()),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(MoviesAnticipatedMappedMock);
  });
});
