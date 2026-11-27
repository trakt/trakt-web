import { MovieLoreVipResponseMock } from '$mocks/data/summary/movie-lore/response/MovieLoreVipResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen, waitFor } from '@testing-library/svelte';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import MovieLorePill from './MovieLorePill.svelte';

const URL = 'http://localhost/v3/movies/dune-part-two-2024/lore';
const MOVIE = { slug: 'dune-part-two-2024', title: 'Dune: Part Two' };

function render() {
  return renderComponent(MovieLorePill, { props: { movie: MOVIE } });
}

describe('MovieLorePill', () => {
  it('should hold the place of the pill while the lore loads', async () => {
    server.use(
      http.get(URL, async () => {
        await delay(200);
        return HttpResponse.json(MovieLoreVipResponseMock);
      }),
    );

    render();

    expect(await screen.findByRole('status')).toBeTruthy();
    expect(
      await screen.findByRole('link', {
        name: 'Open Before you watch for Dune: Part Two',
      }),
    ).toBeTruthy();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('should render nothing, skeleton included, when the movie has no lore', async () => {
    server.use(
      http.get(URL, async () => {
        await delay(200);
        return HttpResponse.json(
          { error: 'movie_lore_not_found' },
          { status: 404 },
        );
      }),
    );

    render();

    expect(await screen.findByRole('status')).toBeTruthy();
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull());
    expect(screen.queryByRole('link')).toBeNull();
  });
});
