import type { CommentResponse } from '@trakt/api';
import { MovieHereticCommentsResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticCommentsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { useMyComments } from './useMyComments.ts';

const olderComment: CommentResponse = {
  ...MovieHereticCommentsResponseMock[0],
  id: 1,
  created_at: '2024-01-01T00:00:00.000Z',
};
const newerComment: CommentResponse = {
  ...MovieHereticCommentsResponseMock[0],
  id: 2,
  created_at: '2024-06-01T00:00:00.000Z',
};

describe('useMyComments', () => {
  it("sorts the viewer's own comments newest first and never reports a next page", async () => {
    server.use(
      http.get(
        'http://localhost/movies/heretic/comments/mine',
        () => HttpResponse.json([olderComment, newerComment]),
      ),
    );

    const { list, hasNextPage } = await renderStore(() =>
      useMyComments(
        new BehaviorSubject({ type: 'movie', slug: 'heretic', enabled: true }),
      )
    );

    const items = await firstValueFrom(
      list.pipe(filter((entries) => entries.length > 0)),
    );

    expect(items.map((entry) => entry.id)).toEqual([2, 1]);
    expect(await firstValueFrom(hasNextPage)).toBe(false);
  });

  it('does not fetch while disabled', async () => {
    let requested = false;
    server.use(
      http.get('http://localhost/movies/heretic/comments/mine', () => {
        requested = true;
        return HttpResponse.json([]);
      }),
    );

    await renderStore(() =>
      useMyComments(
        new BehaviorSubject({ type: 'movie', slug: 'heretic', enabled: false }),
      )
    );
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(requested).toBe(false);
  });
});
