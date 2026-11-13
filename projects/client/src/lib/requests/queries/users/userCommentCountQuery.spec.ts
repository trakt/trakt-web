import { userCommentCountQuery } from '$lib/requests/queries/users/userCommentCountQuery.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

const COMMENTS_URL = 'http://localhost/users/me/comments/all/all';

const runCommentCountQuery = () =>
  runQuery({
    factory: () => createTestBedQuery(userCommentCountQuery({ slug: 'me' })),
    mapper: (response) => response?.data,
    waitFor: (data) => data !== undefined,
  });

describe('userCommentCountQuery', () => {
  it('should read the total from the item count header', async () => {
    server.use(
      http.get(COMMENTS_URL, () =>
        HttpResponse.json([], {
          headers: { 'x-pagination-item-count': '42' },
        }),
      ),
    );

    const result = await runCommentCountQuery();

    expect(result).toBe(42);
  });

  it('should request replies with a single item page', async () => {
    let requestUrl: URL | undefined;
    server.use(
      http.get(COMMENTS_URL, ({ request }) => {
        requestUrl = new URL(request.url);
        return HttpResponse.json([], {
          headers: { 'x-pagination-item-count': '1' },
        });
      }),
    );

    await runCommentCountQuery();

    expect(requestUrl?.searchParams.get('include_replies')).toBe('true');
    expect(requestUrl?.searchParams.get('limit')).toBe('1');
  });

  it('should return null when the header is missing', async () => {
    server.use(http.get(COMMENTS_URL, () => HttpResponse.json([])));

    const result = await runCommentCountQuery();

    expect(result).toBeNull();
  });

  it('should return null for a non-ok response', async () => {
    server.use(
      http.get(COMMENTS_URL, () => new HttpResponse(null, { status: 404 })),
    );

    const result = await runCommentCountQuery();

    expect(result).toBeNull();
  });
});
