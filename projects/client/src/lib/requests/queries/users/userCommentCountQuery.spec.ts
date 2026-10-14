import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { userCommentCountQuery } from './userCommentCountQuery.ts';

const COMMENTS_URL = 'http://localhost/users/me/comments/all/all';
const LIST_COMMENT = { type: 'list', comment: {}, list: {} };

describe('userCommentCountQuery', () => {
  it('should count every comment type from the pagination header', async () => {
    server.use(
      http.get(COMMENTS_URL, () =>
        HttpResponse.json([LIST_COMMENT], {
          headers: { 'x-pagination-item-count': '5' },
        })),
    );

    const result = await runQuery({
      factory: () => createTestBedQuery(userCommentCountQuery({ slug: 'me' })),
      waitFor: (value) => value != null,
      mapper: (value) => value?.data,
    });

    expect(result).toBe(5);
  });

  it('should fall back to the returned page without the header', async () => {
    server.use(http.get(COMMENTS_URL, () => HttpResponse.json([LIST_COMMENT])));

    const result = await runQuery({
      factory: () => createTestBedQuery(userCommentCountQuery({ slug: 'me' })),
      waitFor: (value) => value != null,
      mapper: (value) => value?.data,
    });

    expect(result).toBe(1);
  });
});
