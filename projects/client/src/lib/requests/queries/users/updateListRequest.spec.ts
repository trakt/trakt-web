import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { updateListRequest } from './updateListRequest.ts';

const UPDATE_URL = 'http://localhost/users/me/lists/old-slug/';
const RENAMED_LIST = {
  name: 'New name',
  ids: { trakt: 30998548, slug: 'new-name' },
};

function updateList(
  overrides: Partial<Parameters<typeof updateListRequest>[0]> = {},
) {
  return updateListRequest({
    userId: 'me',
    listId: 'old-slug',
    name: 'New name',
    privacy: 'private',
    ...overrides,
  });
}

describe('updateListRequest', () => {
  it('should return the regenerated slug from an object response', async () => {
    server.use(
      http.put(UPDATE_URL, () => HttpResponse.json(RENAMED_LIST)),
    );

    expect(await updateList()).to.equal('new-name');
  });

  it('should return the regenerated slug from an array response', async () => {
    server.use(
      http.put(UPDATE_URL, () => HttpResponse.json([RENAMED_LIST])),
    );

    expect(await updateList()).to.equal('new-name');
  });

  it('should return undefined when the update fails', async () => {
    server.use(
      http.put(UPDATE_URL, () => new HttpResponse(null, { status: 409 })),
    );

    expect(await updateList()).to.equal(undefined);
  });

  it('should send the default sort fields when provided', async () => {
    let requestBody: unknown;

    server.use(
      http.put(UPDATE_URL, async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json(RENAMED_LIST);
      }),
    );

    await updateList({ sortBy: 'released', sortHow: 'asc' });

    expect(requestBody).to.deep.include({
      sort_by: 'released',
      sort_how: 'asc',
    });
  });
});
