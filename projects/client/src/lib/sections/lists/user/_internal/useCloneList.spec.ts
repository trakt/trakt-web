import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { ListedMoviesMappedMock } from '$mocks/data/lists/mapped/ListedMoviesMappedMock.ts';
import { ListedMoviesResponseMock } from '$mocks/data/lists/response/ListedMoviesResponseMock.ts';
import { ListedShowsMappedMock } from '$mocks/data/lists/mapped/ListedShowsMappedMock.ts';
import { ListedShowsResponseMock } from '$mocks/data/lists/response/ListedShowsResponseMock.ts';
import { SiloListsMappedMock } from '$mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { useCloneList } from './useCloneList.ts';

const list = assertDefined(SiloListsMappedMock.at(0));
const movie = assertDefined(ListedMoviesMappedMock.at(0));
const show = assertDefined(ListedShowsMappedMock.at(0));

const CLONE_ID = 987654;
const CLONE_SLUG = 'silo-lists-copy';

const ITEMS_URL =
  `http://localhost/users/${list.user.slug}/lists/${list.slug}/items/movie,show,season,episode`;

describe('store: useCloneList', () => {
  beforeEach(() => {
    setAuthorization(true);

    /**
     * The clone reads every page of the source list, so the handler has to
     * advertise how many pages there are - without the headers the all-pages
     * query keeps asking for the next one.
     */
    server.use(
      http.get(
        ITEMS_URL,
        () =>
          HttpResponse.json([
            ...ListedMoviesResponseMock,
            ...ListedShowsResponseMock,
          ], {
            headers: {
              'x-pagination-page': '1',
              'x-pagination-page-count': '1',
            },
          }),
      ),
    );
  });

  const mockCreation = (status: number, body: unknown = {}) =>
    server.use(
      http.post(
        'http://localhost/users/me/lists',
        () => HttpResponse.json(body, { status }),
      ),
    );

  it('should copy the source items into the created list', async () => {
    let requestBody: unknown;

    mockCreation(201, { ids: { trakt: CLONE_ID, slug: CLONE_SLUG } });
    server.use(
      http.post(
        `http://localhost/users/me/lists/${CLONE_ID}/items`,
        async ({ request }) => {
          requestBody = await request.json();
          return HttpResponse.json({}, { status: 201 });
        },
      ),
    );

    const { saveList } = await renderStore(() => useCloneList(list));

    const slug = await saveList({ name: 'My Copy', privacy: 'private' });

    expect(slug).toBe(CLONE_SLUG);
    expect(requestBody).to.deep.equal({
      movies: [{
        ids: { trakt: movie.type === 'movie' ? movie.entry.id : 0 },
      }],
      shows: [{ ids: { trakt: show.type === 'show' ? show.entry.id : 0 } }],
      seasons: [],
      episodes: [],
    });
  });

  it('should NOT copy items when the list could not be created', async () => {
    let hasAdded = false;

    mockCreation(420);
    server.use(
      http.post(
        `http://localhost/users/me/lists/${CLONE_ID}/items`,
        () => {
          hasAdded = true;
          return HttpResponse.json({}, { status: 201 });
        },
      ),
    );

    const { saveList } = await renderStore(() => useCloneList(list));

    expect(await saveList({ name: 'My Copy', privacy: 'private' })).toBe(
      undefined,
    );
    expect(hasAdded).toBe(false);
  });

  it('should NOT create a list for a blank name', async () => {
    let hasCreated = false;

    server.use(
      http.post('http://localhost/users/me/lists', () => {
        hasCreated = true;
        return HttpResponse.json({}, { status: 201 });
      }),
    );

    const { saveList } = await renderStore(() => useCloneList(list));

    expect(await saveList({ name: '  ', privacy: 'private' })).toBe(undefined);
    expect(hasCreated).toBe(false);
  });
});
