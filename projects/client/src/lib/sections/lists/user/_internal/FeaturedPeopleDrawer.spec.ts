import { PersonFergusonMappedMock } from '$mocks/data/people/mapped/PersonFergusonMappedMock.ts';
import { mapToPersonSummary } from '$lib/requests/_internal/mapToPersonSummary.ts';
import { PersonGrantResponseMock } from '$mocks/data/people/response/PersonGrantResponseMock.ts';
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
    server.use(
      http.get(
        `http://localhost/people/${PersonGrantResponseMock.ids.slug}`,
        () => HttpResponse.json(PersonGrantResponseMock),
      ),
    );
    renderComponent(FeaturedPeopleDrawer, {
      props: {
        people: [
          PersonFergusonMappedMock,
          mapToPersonSummary(PersonGrantResponseMock),
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
  });
});
