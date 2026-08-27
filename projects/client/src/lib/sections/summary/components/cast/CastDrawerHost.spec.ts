import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import CastDrawerHost from './CastDrawerHost.svelte';

beforeAll(() => {
  Element.prototype.scrollTo = vi.fn();
});

describe('CastDrawerHost', () => {
  it('filters credits and searches locally', async () => {
    const user = userEvent.setup();
    const crew = {
      ...ShowSiloPeopleMappedMock,
      cast: [
        {
          ...ShowSiloPeopleMappedMock.cast[0]!,
          characters: [
            'Juliette Nichols',
            'Juliette Nichols (voice)',
            'Juliette Nichols (archive footage)',
          ],
        },
        ...ShowSiloPeopleMappedMock.cast.slice(1),
      ],
    };

    renderComponent(CastDrawerHost, {
      props: {
        crew,
        type: 'show',
        onClose: vi.fn(),
      },
    });

    await waitFor(() => {
      expect(screen.getByRole('searchbox', { name: 'Search people' }))
        .toBeInTheDocument();
    });

    expect(document.querySelector('.trakt-drawer')).toHaveAttribute(
      'data-header-variant',
      'overlay',
    );
    expect(screen.getByText('People')).toBeInTheDocument();
    expect(screen.getByText('Cast')).toBeInTheDocument();
    expect(screen.getByText('Rebecca Ferguson')).toBeInTheDocument();
    expect(screen.getByText('Juliette Nichols'))
      .toBeInTheDocument();
    expect(screen.queryByText('Juliette Nichols (voice)')).not
      .toBeInTheDocument();
    const moreCharactersButton = screen.getByRole('button', {
      name: 'Expand Characters',
    });
    expect(moreCharactersButton).toHaveTextContent(/\+\s*2 more/);

    await user.click(moreCharactersButton);

    expect(screen.getByText('Juliette Nichols (voice)')).toBeInTheDocument();
    expect(screen.getByText('Juliette Nichols (archive footage)'))
      .toBeInTheDocument();
    expect(moreCharactersButton).toHaveTextContent(/-\s*2 more/);

    const searchInput = screen.getByRole('searchbox', {
      name: 'Search people',
    });
    await user.type(searchInput, 'Rebecca');

    await waitFor(() => {
      expect(screen.getByText('Cast & Crew')).toBeInTheDocument();
    });
    expect(screen.getByText('Juliette Nichols (voice)')).toBeInTheDocument();

    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByText('Cast')).toBeInTheDocument();
    });
    expect(screen.getByText('Juliette Nichols (voice)')).toBeInTheDocument();

    await user.click(moreCharactersButton);

    expect(screen.queryByText('Juliette Nichols (voice)')).not
      .toBeInTheDocument();
    expect(screen.getByAltText('Headshot of Rebecca Ferguson'))
      .toBeInTheDocument();
    expect(screen.queryByText('Graham Yost')).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Cast' }))
      .toHaveTextContent('');
    expect(screen.getByRole('radio', { name: 'Crew' }))
      .toHaveTextContent('');

    await user.click(screen.getByRole('radio', { name: 'Crew' }));

    await waitFor(() => {
      expect(screen.getAllByText('Graham Yost')).not.toHaveLength(0);
    });
    expect(screen.getByText('Creator, Writer')).toBeInTheDocument();
    expect(screen.getByText('Crew')).toBeInTheDocument();
    expect(screen.queryByAltText('Headshot of Graham Yost'))
      .not.toBeInTheDocument();
    expect(screen.queryByText('Rebecca Ferguson')).not.toBeInTheDocument();

    const search = screen.getByRole('searchbox', {
      name: 'Search people',
    });
    await user.type(search, 'Rebecca');

    await waitFor(() => {
      expect(screen.getByText('Rebecca Ferguson')).toBeInTheDocument();
    });
    expect(screen.getByText('Cast & Crew')).toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: 'Cast' })).not
      .toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: 'Crew' })).not
      .toBeInTheDocument();

    await user.clear(search);

    await waitFor(() => {
      expect(screen.getByText('Crew')).toBeInTheDocument();
    });
    expect(screen.getByRole('radio', { name: 'Cast' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Crew' })).toBeInTheDocument();
  });
});
