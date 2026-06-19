import { ShowSiloMinimalResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloMinimalResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { currentUserRewatchingQuery } from './currentUserRewatchingQuery.ts';

describe('currentUserRewatchingQuery', () => {
  it('should query rewatching shows', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(currentUserRewatchingQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).toEqual({
      shows: new Set([ShowSiloMinimalResponseMock.ids.trakt]),
    });
  });
});
