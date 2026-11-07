import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import GenreSlots from './GenreSlots.svelte';

function serveUserGenres(
  genres: { favorites: string[]; disliked: string[] } = {
    favorites: ['action'],
    disliked: ['horror'],
  },
) {
  server.use(
    http.get('http://localhost/users/settings', () => {
      return HttpResponse.json({
        ...ExtendedUsersResponseMock,
        browsing: {
          ...ExtendedUsersResponseMock.browsing,
          genres,
        },
      });
    }),
  );
}

function trackSettingsRequests() {
  const requests: unknown[] = [];

  server.use(
    http.put('http://localhost/users/settings', async ({ request }) => {
      requests.push(await request.json());
      return new HttpResponse(null, { status: 204 });
    }),
  );

  return requests;
}

async function editGenres({ row, toggle }: { row: string; toggle: string[] }) {
  const user = userEvent.setup();

  renderComponent(GenreSlots, { props: {} });

  const button = await screen.findByRole('button', { name: row });
  await waitFor(() =>
    expect(button.querySelector('[data-genre]')).not.toBeNull(),
  );
  await user.click(button);

  for (const genre of toggle) {
    await user.click(
      await screen.findByRole('button', { name: `Toggle the ${genre} genre` }),
    );
  }
  await user.click(screen.getByRole('button', { name: 'Apply changes' }));
}

describe('GenreSlots', () => {
  beforeEach(() => {
    setAuthorization(true);
    serveUserGenres();
  });

  it('should show both liked and disliked genres', async () => {
    renderComponent(GenreSlots, { props: {} });

    const liked = await screen.findByRole('button', {
      name: 'Edit genres you like',
    });
    const disliked = screen.getByRole('button', {
      name: 'Edit genres you dislike',
    });

    await waitFor(() => {
      expect(liked.querySelector('[data-genre="action"]')).not.toBeNull();
      expect(disliked.querySelector('[data-genre="horror"]')).not.toBeNull();
    });
  });

  it('should move a liked genre out of liked when it is disliked', async () => {
    const requests = trackSettingsRequests();

    await editGenres({ row: 'Edit genres you dislike', toggle: ['Action'] });

    await waitFor(() =>
      expect(requests).toEqual([
        {
          browsing: {
            genres: { favorites: [], disliked: ['horror', 'action'] },
          },
        },
      ]),
    );
  });

  it('should move a disliked genre out of disliked when it is liked', async () => {
    const requests = trackSettingsRequests();

    await editGenres({ row: 'Edit genres you like', toggle: ['Horror'] });

    await waitFor(() =>
      expect(requests).toEqual([
        {
          browsing: {
            genres: { favorites: ['action', 'horror'], disliked: [] },
          },
        },
      ]),
    );
  });

  it('should clear a genre saved in both lists', async () => {
    serveUserGenres({ favorites: ['action'], disliked: ['action'] });
    const requests = trackSettingsRequests();

    await editGenres({ row: 'Edit genres you like', toggle: ['Drama'] });

    await waitFor(() =>
      expect(requests).toEqual([
        {
          browsing: {
            genres: { favorites: ['action', 'drama'], disliked: [] },
          },
        },
      ]),
    );
  });
});
