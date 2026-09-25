import type { CommentResponse } from '@trakt/api';
import { MovieHereticCommentsResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticCommentsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  firstValueFrom,
  type Observable,
} from 'rxjs';
import { describe, expect, it } from 'vitest';
import { useCommentsWithPinnedMine } from './useCommentsWithPinnedMine.ts';

const othersComment: CommentResponse = {
  ...MovieHereticCommentsResponseMock[0],
  id: 100,
};
const myComment: CommentResponse = {
  ...MovieHereticCommentsResponseMock[0],
  id: 200,
};

function mockEndpoints(
  mine: CommentResponse[],
  normalList: CommentResponse[] = [othersComment],
) {
  server.use(
    http.get(
      'http://localhost/movies/heretic/comments/newest*',
      () =>
        HttpResponse.json(normalList, {
          headers: {
            'X-Pagination-Page': '1',
            'X-Pagination-Page-Count': '1',
          },
        }),
    ),
    http.get(
      'http://localhost/movies/heretic/comments/mine',
      () => HttpResponse.json(mine),
    ),
  );
}

function renderPinnedList(pinMine$: Observable<boolean>) {
  return renderStore(() =>
    useCommentsWithPinnedMine({
      type: 'movie',
      slug: 'heretic',
      sort: 'newest',
      pinMine$,
      myCommentsParams$: new BehaviorSubject({
        type: 'movie' as const,
        slug: 'heretic',
        enabled: true,
      }),
    })
  );
}

async function settledItems<T>(
  list: Observable<T[]>,
  isLoading: Observable<boolean>,
): Promise<T[]> {
  const [items] = await firstValueFrom(
    combineLatest([list, isLoading]).pipe(filter(([, loading]) => !loading)),
  );
  return items;
}

describe('useCommentsWithPinnedMine', () => {
  it('pins the latest own comment ahead of the normal list when enabled', async () => {
    mockEndpoints([myComment]);

    const { list, isLoading } = await renderPinnedList(
      new BehaviorSubject(true),
    );

    const items = await settledItems(list, isLoading);

    expect(items.map((entry) => entry.id)).toEqual([200, 100]);
  });

  it('leaves the list untouched when the flag is off', async () => {
    mockEndpoints([myComment]);

    const { list, isLoading } = await renderPinnedList(
      new BehaviorSubject(false),
    );

    const items = await settledItems(list, isLoading);

    expect(items.map((entry) => entry.id)).toEqual([100]);
  });

  it('does not duplicate an own comment already present in the normal list', async () => {
    mockEndpoints([othersComment]);

    const { list, isLoading } = await renderPinnedList(
      new BehaviorSubject(true),
    );

    const items = await settledItems(list, isLoading);

    expect(items.map((entry) => entry.id)).toEqual([100]);
  });

  it('moves an own comment already loaded on the page to the front', async () => {
    mockEndpoints([myComment], [othersComment, myComment]);

    const { list, isLoading } = await renderPinnedList(
      new BehaviorSubject(true),
    );

    const items = await settledItems(list, isLoading);

    expect(items.map((entry) => entry.id)).toEqual([200, 100]);
  });

  it('pins once the flag turns on, without rebuilding the hook', async () => {
    mockEndpoints([myComment]);
    const pinMine$ = new BehaviorSubject(false);

    const { list, isLoading } = await renderPinnedList(pinMine$);

    expect((await settledItems(list, isLoading)).map((entry) => entry.id))
      .toEqual([100]);

    pinMine$.next(true);

    const pinned = await firstValueFrom(
      list.pipe(filter((entries) => entries.length === 2)),
    );
    expect(pinned.map((entry) => entry.id)).toEqual([200, 100]);
  });
});
