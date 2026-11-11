import type { SearchResponse } from '$lib/features/search/models/SearchResponse.ts';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import SearchReport from './SearchReport.svelte';

const results = {
  type: 'media',
  items: [{ type: 'movie', title: 'Dune', year: 2021, slug: 'dune-2021' }],
} as unknown as SearchResponse;

describe('SearchReport', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should send the query, expectation and shown results', async () => {
    const user = userEvent.setup();
    const sent: FormData[] = [];

    server.use(
      http.post('*/api/report', async ({ request }) => {
        sent.push(await request.formData());
        return HttpResponse.json({ ok: true });
      }),
    );

    renderComponent(SearchReport, {
      props: { query: 'dune', mode: 'movie', results },
    });

    await user.click(
      await screen.findByRole('button', {
        name: 'Report that search results are missing or wrong',
      }),
    );

    expect(
      await screen.findByPlaceholderText('What were you searching for?'),
    ).toHaveValue('dune');

    const send = screen.getByRole('button', {
      name: 'Send the report to the Trakt team',
    });
    expect(send).toBeDisabled();

    const link = screen.getByPlaceholderText(
      'Link to it on IMDb, TMDB, Rotten Tomatoes, Letterboxd, TVDB, Metacritic or Wikipedia',
    );
    await waitFor(() => expect(link).toHaveFocus());

    await user.type(
      screen.getByPlaceholderText('What were you searching for?'),
      ' 1984',
    );
    await user.type(
      screen.getByPlaceholderText(
        'What did you expect to find? A title and year help.',
      ),
      'The 1984 film',
    );
    await user.type(link, 'https://example.com/dune');
    expect(send).toBeDisabled();

    await user.clear(link);
    await user.type(link, 'https://www.imdb.com/title/tt0087182/');
    expect(send).toBeEnabled();

    await user.click(send);

    await waitFor(() => expect(sent).toHaveLength(1));
    const body = sent.at(0);
    expect(body?.get('kind')).toBe('search');
    expect(body?.get('query')).toBe('dune');
    expect(body?.get('intent')).toBe('dune 1984');
    expect(body?.get('link')).toBe('https://www.imdb.com/title/tt0087182/');
    expect(body?.get('expected')).toBe('The 1984 film');
    expect(body?.get('mode')).toBe('movie');
    expect(body?.getAll('results')).toEqual(['movie: Dune (2021) [dune-2021]']);
  });
});
