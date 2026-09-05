import { HiddenShowProgressResponseMock } from '$mocks/data/users/response/HiddenShowProgressResponseMock.ts';
import { UpNextResponseMock } from '$mocks/data/sync/response/UpNextResponseMock.ts';
import { server } from '$mocks/server.ts';
import type { ProgressEntry } from '$lib/requests/models/ProgressEntry.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import type { UpNextResponse } from '@trakt/api';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { type ProgressListType, useProgressList } from './useProgressList.ts';

const [baseEntry] = UpNextResponseMock;

const ENDED_SHOW = 'ended-show';
const AIRING_SHOW = 'airing-show';
const DROPPED_SHOW = 'dropped-show';

function withShow(
  { status, slug, trakt }: {
    status: string;
    slug: string;
    trakt: number;
  },
): UpNextResponse {
  return {
    ...baseEntry,
    show: {
      ...baseEntry.show,
      status,
      title: slug,
      ids: { ...baseEntry.show.ids, slug, trakt },
    },
  };
}

function serveCompletedBucket() {
  server.use(
    http.get(
      'http://localhost/sync/progress/up_next*',
      () =>
        HttpResponse.json([
          withShow({ status: 'ended', slug: ENDED_SHOW, trakt: 101 }),
          withShow({
            status: 'returning series',
            slug: AIRING_SHOW,
            trakt: 102,
          }),
        ]),
    ),
  );
}

/**
 * The dropped bucket comes from a different endpoint and must not be split on
 * status, so it is served an ended show: if the status predicate ever leaked
 * onto this branch, the show would vanish and this fails.
 */
function serveDroppedBucket() {
  const [base] = HiddenShowProgressResponseMock;

  server.use(
    http.get('http://localhost/users/hidden/dropped*', () =>
      HttpResponse.json([
        {
          ...base,
          show: {
            ...base.show,
            status: 'ended',
            title: DROPPED_SHOW,
            ids: { ...base.show.ids, slug: DROPPED_SHOW, trakt: 103 },
          },
        },
      ])),
  );
}

function listTitles(type: ProgressListType) {
  return runQuery({
    factory: () => useProgressList({ type }).list,
    waitFor: (entries: ProgressEntry[]) => entries.length > 0,
    mapper: (entries: ProgressEntry[]) =>
      entries.map((entry) => entry.show.title),
  });
}

describe('store: useProgressList', () => {
  beforeEach(() => {
    setAuthorization(true);
    serveCompletedBucket();
  });

  it('should keep only still airing shows under "up to date"', async () => {
    expect(await listTitles('completed')).toEqual([AIRING_SHOW]);
  });

  it('should keep only finished shows under "ended"', async () => {
    expect(await listTitles('ended')).toEqual([ENDED_SHOW]);
  });

  it('should not filter the dropped bucket by status', async () => {
    serveDroppedBucket();

    expect(await listTitles('dropped')).toEqual([DROPPED_SHOW]);
  });

  it('should not filter by status on the in progress bucket', async () => {
    expect(await listTitles('in-progress')).toEqual([
      ENDED_SHOW,
      AIRING_SHOW,
    ]);
  });
});
