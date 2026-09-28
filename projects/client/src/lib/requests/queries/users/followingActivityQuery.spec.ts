import { followingActivityQuery } from '$lib/requests/queries/users/followingActivityQuery.ts';
import { FollowingActivityMappedMock } from '$mocks/data/users/mapped/FollowingActivityMappedMock.ts';
import { FollowingActivityResponseMock } from '$mocks/data/users/response/FollowingActivityResponseMock.ts';
import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';

const startDate = new Date('2026-09-27T14:00:00.000Z');
const endDate = new Date('2026-09-28T14:00:00.000Z');

describe('followingActivityQuery', () => {
  it('should map watch, rating and comment activity', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          followingActivityQuery({ startDate, endDate, limit: 100 }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(FollowingActivityMappedMock);
  });

  it('should send the window and the requested actions', async () => {
    const urls: URL[] = [];
    const record = ({ request }: { request: Request }) => {
      urls.push(new URL(request.url));
    };
    server.events.on('request:start', record);

    await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          followingActivityQuery({
            startDate,
            endDate,
            actions: ['rating', 'comment'],
            limit: 100,
          }),
        ),
      mapper: mapToEntries,
    });
    server.events.removeListener('request:start', record);

    const url = urls.find((candidate) =>
      candidate.pathname === '/v3/users/me/following/activities'
    );
    expect(url?.searchParams.get('start_at')).toBe(startDate.toISOString());
    expect(url?.searchParams.get('end_at')).toBe(endDate.toISOString());
    expect(url?.searchParams.get('action')).toBe('rating,comment');
    expect(url?.searchParams.get('limit')).toBe('100');
  });

  it('should leave the window to the api when no dates are given', async () => {
    const urls: URL[] = [];
    const record = ({ request }: { request: Request }) => {
      urls.push(new URL(request.url));
    };
    server.events.on('request:start', record);

    await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(followingActivityQuery({ limit: 250 })),
      mapper: mapToEntries,
    });
    server.events.removeListener('request:start', record);

    const url = urls.find((candidate) =>
      candidate.pathname === '/v3/users/me/following/activities'
    );
    expect(url?.searchParams.has('start_at')).toBe(false);
    expect(url?.searchParams.has('end_at')).toBe(false);
  });

  it('should drop entries it does not understand', async () => {
    server.use(
      http.get(
        'http://localhost/v3/users/me/following/activities',
        () =>
          HttpResponse.json(
            [...FollowingActivityResponseMock, { id: 5, action: 'like' }],
            { headers: { 'X-Pagination-Page-Count': '1' } },
          ),
      ),
    );

    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(followingActivityQuery({ limit: 250 })),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(FollowingActivityMappedMock);
  });
});
