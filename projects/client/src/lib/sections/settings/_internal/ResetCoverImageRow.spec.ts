import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import ResetCoverImageRow from './ResetCoverImageRow.svelte';

function serveUserWithoutCover() {
  server.use(
    http.get('http://localhost/users/settings', () => {
      return HttpResponse.json({
        ...ExtendedUsersResponseMock,
        user: { ...ExtendedUsersResponseMock.user, vip_cover_image: null },
      });
    }),
  );
}

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

describe('ResetCoverImageRow', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should confirm before clearing the cover', async () => {
    const user = userEvent.setup();
    const requests = trackCoverRequests();

    renderComponent(ResetCoverImageRow, { props: {} });

    const button = await screen.findByRole('button', {
      name: 'Reset your cover image to the default artwork.',
    });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Reset cover image?')).toBeInTheDocument();
    });

    expect(requests).to.deep.equal([]);
  });

  it('should offer the reset when there is a cover image', async () => {
    renderComponent(ResetCoverImageRow, { props: {} });

    const button = await screen.findByRole('button', {
      name: 'Reset your cover image to the default artwork.',
    });

    await waitFor(() => expect(button).toBeEnabled());
  });

  it('should disable the reset when there is no cover image', async () => {
    serveUserWithoutCover();

    renderComponent(ResetCoverImageRow, { props: {} });

    const button = await screen.findByRole('button', {
      name: 'Reset your cover image to the default artwork.',
    });

    expect(button).toBeDisabled();
  });
});
