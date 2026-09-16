import { mapToPersonSummary } from '$lib/requests/_internal/mapToPersonSummary.ts';
import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import FeaturedPeopleDrawer from './FeaturedPeopleDrawer.svelte';

beforeAll(() => {
  Element.prototype.scrollTo = vi.fn();
});

describe('FeaturedPeopleDrawer', () => {
  it('should show all featured people, search names, and restore the list', async () => {
    const user = userEvent.setup();
    const requestPerson = vi.fn(() => HttpResponse.json({}));
    server.use(
      http.get(
        'http://localhost/people/:slug',
        requestPerson,
      ),
    );
    renderComponent(FeaturedPeopleDrawer, {
      props: {
        people: [
          mapToPersonSummary({
            name: 'Rebecca Ferguson',
            ids: { trakt: 2, slug: 'rebecca-ferguson' },
            images: {
              headshot: [
                'https://walter.trakt.tv/images/people/2/headshots/medium/rebecca.webp',
              ],
              fanart: [],
            },
          }),
          mapToPersonSummary({
            name: 'Hugh Grant',
            ids: { trakt: 1, slug: 'hugh-grant' },
            images: { headshot: [], fanart: [] },
          }),
        ],
        onClose: vi.fn(),
      },
    });

    const search = await screen.findByRole('searchbox', {
      name: 'Search people',
    });
    expect(screen.getByText('Featured People')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Rebecca Ferguson/ }))
      .toBeInTheDocument();
    expect(screen.getByText('Hugh Grant')).toBeInTheDocument();

    expect(screen.getByRole('img', { name: /Rebecca Ferguson/ }))
      .toHaveAttribute(
        'src',
        'https://walter.trakt.tv/images/people/2/headshots/thumb/rebecca.webp',
      );

    await user.type(search, '  REBECCA  ');
    await waitFor(() =>
      expect(screen.queryByText('Hugh Grant')).not.toBeInTheDocument()
    );
    expect(screen.getByText('Rebecca Ferguson')).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'no matching person');
    await waitFor(() =>
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    );

    await user.clear(search);
    await waitFor(() =>
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    );
    expect(requestPerson).not.toHaveBeenCalled();
  });
});
