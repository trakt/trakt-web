import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CheckInAction from './CheckInAction.svelte';

describe('CheckInAction', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should explain when the check in request fails', async () => {
    const user = userEvent.setup();
    const onCheckIn = vi.fn();
    server.use(
      http.post('http://localhost/checkin', () => HttpResponse.error()),
    );

    renderComponent(CheckInAction, {
      props: {
        style: 'normal',
        title: MovieHereticMappedMock.title,
        type: 'movie',
        media: MovieHereticMappedMock,
        onCheckIn,
      },
    });
    await user.click(await screen.findByRole('button'));

    expect(await screen.findByText("Couldn't check in")).toBeInTheDocument();
    expect(onCheckIn).not.toHaveBeenCalled();
  });
});
