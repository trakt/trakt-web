import type { ListTarget } from '$lib/models/ListTarget.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import ListsDrawer from './ListsDrawer.svelte';

const LIST_ID = 37_255_911;
const LIST_NAME = 'Seasons and eps';
const OWNER_ID = 14_360_847;

const targets: [string, string, ListTarget][] = [
  [
    'episode',
    `http://localhost/v3/episodes/${EpisodeSiloMappedMock.id}/me/lists`,
    { type: 'episode', media: EpisodeSiloMappedMock },
  ],
  [
    'movie',
    `http://localhost/v3/movies/${MovieHereticMappedMock.slug}/me/lists`,
    { type: 'movie', media: MovieHereticMappedMock },
  ],
];

describe('ListsDrawer', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it.each(targets)(
    'should mark the list as added after adding a %s to it',
    async (_type, listIdsUrl, target) => {
      const user = userEvent.setup();
      let isAdded = false;

      server.use(
        http.get('http://localhost/v3/users/me/lists', () => {
          return HttpResponse.json([{
            id: LIST_ID,
            name: LIST_NAME,
            count: 3,
            type: 'standard',
            display_order: 1,
            owner_id: OWNER_ID,
          }]);
        }),
        http.post(
          `http://localhost/users/${OWNER_ID}/lists/${LIST_ID}/items`,
          () => {
            isAdded = true;
            return HttpResponse.json({}, { status: 201 });
          },
        ),
        http.get(listIdsUrl, () => {
          return HttpResponse.json(isAdded ? [LIST_ID] : []);
        }),
      );

      const title = 'Freedom Day';
      renderComponent(ListsDrawer, {
        props: { onClose: () => {}, title, target },
      });

      const row = await screen.findByText(LIST_NAME);

      const bookmarkFill = () =>
        row
          .closest('li')
          ?.querySelector('.trakt-bookmark-path')
          ?.getAttribute('fill');

      await waitFor(() => expect(bookmarkFill()).toBe('transparent'));

      await user.click(row);

      await waitFor(() => expect(bookmarkFill()).toBe('currentColor'));
    },
  );
});
