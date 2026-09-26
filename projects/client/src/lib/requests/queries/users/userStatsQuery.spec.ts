import { userStatsQuery } from '$lib/requests/queries/users/userStatsQuery.ts';
import { UserStatsMappedMock } from '$mocks/data/users/mapped/UserStatsMappedMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

const STATS_URL = 'http://localhost/users/me/stats';

const runStatsQuery = () =>
  runQuery({
    factory: () => createTestBedQuery(userStatsQuery({ slug: 'me' })),
    mapper: (response) => response?.data,
    // `null` is a valid result (hidden profile or empty body), so only skip
    // the pending `undefined` emissions.
    waitFor: (data) => data !== undefined,
  });

describe('userStatsQuery', () => {
  it('should query user stats', async () => {
    const result = await runStatsQuery();

    expect(result).to.deep.equal(UserStatsMappedMock);
  });

  it('should return null for a hidden profile', async () => {
    server.use(
      http.get(STATS_URL, () => new HttpResponse(null, { status: 404 })),
    );

    const result = await runStatsQuery();

    expect(result).toBeNull();
  });

  it('should return null for a no content response', async () => {
    server.use(
      http.get(STATS_URL, () => new HttpResponse(null, { status: 204 })),
    );

    const result = await runStatsQuery();

    expect(result).toBeNull();
  });

  it('should return null for an empty successful response', async () => {
    server.use(
      http.get(STATS_URL, () => new HttpResponse('', { status: 200 })),
    );

    const result = await runStatsQuery();

    expect(result).toBeNull();
  });
});
