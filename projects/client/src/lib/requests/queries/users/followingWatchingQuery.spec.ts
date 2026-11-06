import { followingWatchingQuery } from '$lib/requests/queries/users/followingWatchingQuery.ts';
import { FollowingWatchingMappedMock } from '$mocks/data/users/mapped/FollowingWatchingMappedMock.ts';
import { FollowingWatchingResponseMock } from '$mocks/data/users/response/FollowingWatchingResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

describe('followingWatchingQuery', () => {
  it('should map who the user follows is watching now', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(followingWatchingQuery({})),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(FollowingWatchingMappedMock);
  });

  it('should drop entries that do not match the response schema', async () => {
    server.use(
      http.get('http://localhost/v3/users/me/following/watching', () =>
        HttpResponse.json([...FollowingWatchingResponseMock, { user: null }]),
      ),
    );

    const result = await runQuery({
      factory: () => createTestBedQuery(followingWatchingQuery({})),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(FollowingWatchingMappedMock);
  });
});
