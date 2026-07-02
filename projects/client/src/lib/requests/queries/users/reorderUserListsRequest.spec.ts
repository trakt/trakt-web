import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { reorderUserListsRequest } from './reorderUserListsRequest.ts';

describe('reorderUserListsRequest', () => {
  it('should post list ids in rank order', async () => {
    let requestBody: unknown;

    server.use(
      http.post('http://localhost/users/me/lists/reorder', async (
        { request },
      ) => {
        requestBody = await request.json();
        return HttpResponse.json({ updated: 2, skipped_ids: [] });
      }),
    );

    const result = await reorderUserListsRequest({
      userId: 'me',
      rank: [2, 1],
    });

    expect(result).to.equal(true);
    expect(requestBody).to.deep.equal({ rank: [2, 1] });
  });
});
