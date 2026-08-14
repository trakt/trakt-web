import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, waitFor, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import SetCoverImageAction from './SetCoverImageAction.svelte';

const COVER_URL =
  'https://walter.trakt.tv/images/movies/000/001/000/artwork.jpg';

function trackCoverRequests() {
  const requests: unknown[] = [];

  server.use(
    http.put('http://localhost/users/set_cover', async ({ request }) => {
      requests.push(await request.json());
      return new HttpResponse(null, { status: 204 });
    }),
  );

  return requests;
}

async function openConfirmation() {
  const user = userEvent.setup();

  renderComponent(SetCoverImageAction, {
    props: {
      style: 'dropdown-item',
      type: 'movie',
      id: 1000,
      title: 'Heretic',
      coverUrl: COVER_URL,
    },
  });

  const item = await screen.findByRole('button', {
    name: /set as cover image/i,
  });
  await user.click(item);

  return { user, dialog: await screen.findByRole('dialog') };
}

describe('SetCoverImageAction', () => {
  beforeEach(() => {
    setAuthorization(true);

    document.body.style.pointerEvents = '';
  });

  it('should preview the artwork before setting it as the cover', async () => {
    const requests = trackCoverRequests();

    const { dialog } = await openConfirmation();

    await waitFor(() => {
      expect(dialog.querySelector('img')).toHaveAttribute('src', COVER_URL);
    });

    expect(within(dialog).getByText('Heretic', { exact: false }))
      .toBeInTheDocument();
    expect(requests).to.deep.equal([]);
  });

  it('should set the cover image once the preview is confirmed', async () => {
    const requests = trackCoverRequests();

    const { user, dialog } = await openConfirmation();

    await user.click(
      within(dialog).getByRole('button', { name: /^yes$/i }),
    );

    await waitFor(() => {
      expect(requests).to.deep.equal([
        { cover_type: 'movie', cover_id: 1000 },
      ]);
    });
  });
});
