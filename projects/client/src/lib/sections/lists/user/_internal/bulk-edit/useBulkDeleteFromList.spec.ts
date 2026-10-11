import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { ListedMoviesMappedMock } from '$mocks/data/lists/mapped/ListedMoviesMappedMock.ts';
import { ListedShowsMappedMock } from '$mocks/data/lists/mapped/ListedShowsMappedMock.ts';
import { SiloListsMappedMock } from '$mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { captureRequests } from '$test/beds/request/captureRequests.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { useBulkDeleteFromList } from './useBulkDeleteFromList.ts';

const list = assertDefined(SiloListsMappedMock.at(0));
const movie = assertDefined(ListedMoviesMappedMock.at(0));
const show = assertDefined(ListedShowsMappedMock.at(0));

describe('store: useBulkDeleteFromList', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should remove every selected item from the list in one request', async () => {
    let requestBody: unknown;

    server.use(
      http.post(
        `http://localhost/users/me/lists/${list.slug}/items/remove`,
        async ({ request }) => {
          requestBody = await request.json();
          return HttpResponse.json({}, { status: 200 });
        },
      ),
    );

    const { deleteItems } = await renderStore(() =>
      useBulkDeleteFromList(list)
    );

    const didDelete = await deleteItems([movie, show]);

    expect(didDelete).toBe(true);
    expect(requestBody).to.deep.equal({
      movies: [{
        ids: { trakt: movie.type === 'movie' ? movie.entry.id : 0 },
      }],
      shows: [{ ids: { trakt: show.type === 'show' ? show.entry.id : 0 } }],
      seasons: [],
      episodes: [],
    });
  });

  it('should NOT send a request when nothing is selected', async () => {
    let hasRequested = false;

    server.use(
      http.post(
        `http://localhost/users/me/lists/${list.slug}/items/remove`,
        () => {
          hasRequested = true;
          return HttpResponse.json({}, { status: 200 });
        },
      ),
    );

    const { deleteItems } = await renderStore(() =>
      useBulkDeleteFromList(list)
    );

    expect(await deleteItems([])).toBe(false);
    expect(hasRequested).toBe(false);
  });

  it('should hit the remove endpoint', async () => {
    server.use(
      http.post(
        `http://localhost/users/me/lists/${list.slug}/items/remove`,
        () => HttpResponse.json({}, { status: 200 }),
      ),
    );

    const { deleteItems } = await renderStore(() =>
      useBulkDeleteFromList(list)
    );

    const requests = await captureRequests(async () => {
      await deleteItems([movie]);
    });

    expect(requests).to.include(
      `POST /users/me/lists/${list.slug}/items/remove`,
    );
  });
});
