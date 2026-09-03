import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { updateListRequest } from './updateListRequest.ts';

const UPDATE_URL = 'http://localhost/users/me/lists/old-slug/';

function updateList() {
  return updateListRequest({
    userId: 'me',
    listId: 'old-slug',
    name: 'New name',
    privacy: 'private',
  });
}

describe('updateListRequest', () => {
  it('should return the regenerated slug from an object response', async () => {
    server.use(
      http.put(UPDATE_URL, () =>
        HttpResponse.json({
          name: 'New name',
          ids: { trakt: 30998548, slug: 'new-name' },
        })),
    );

    expect(await updateList()).to.equal('new-name');
  });

  it('should return the regenerated slug from an array response', async () => {
    server.use(
      http.put(UPDATE_URL, () =>
        HttpResponse.json([
          {
            name: 'New name',
            ids: { trakt: 30998548, slug: 'new-name' },
          },
        ])),
    );

    expect(await updateList()).to.equal('new-name');
  });

  it('should return undefined when the update fails', async () => {
    server.use(
      http.put(UPDATE_URL, () => new HttpResponse(null, { status: 409 })),
    );

    expect(await updateList()).to.equal(undefined);
  });
});
