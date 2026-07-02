import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { EpisodeSiloPeopleMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloPeopleMappedMock.ts';
import { MovieHereticPeopleMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticPeopleMappedMock.ts';
import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { fireEvent, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import CastDrawerHost from './CastDrawerHost.svelte';

beforeAll(() => {
  Element.prototype.scrollTo = vi.fn();
});

async function finishToggleTransition() {
  const tracker = document.querySelector('.tracker');
  expect(tracker).toBeInTheDocument();

  const transitionEnd = new Event('transitionend', { bubbles: true });
  Object.defineProperty(transitionEnd, 'propertyName', {
    value: 'left',
  });

  await fireEvent(tracker as Element, transitionEnd);
}

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
    expect(screen.getByRole('heading', {
      name: `Cast ${crew.cast.length} people`,
    })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Supporting Cast/ })).not
      .toBeInTheDocument();
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
    expect(screen.getByRole('heading', {
      name: 'Cast 1 person',
    })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Supporting Cast/ })).not
      .toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /^Crew/ })).not
      .toBeInTheDocument();
    expect(screen.getByText('Juliette Nichols (voice)')).toBeInTheDocument();

    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByRole('heading', {
        name: `Cast ${crew.cast.length} people`,
      })).toBeInTheDocument();
    });
    expect(screen.getByText('Juliette Nichols (voice)')).toBeInTheDocument();

    await user.click(moreCharactersButton);

    expect(screen.queryByText('Juliette Nichols (voice)')).not
      .toBeInTheDocument();
    expect(screen.getByAltText('Headshot of Rebecca Ferguson'))
      .toBeInTheDocument();
    expect(screen.queryByText('Graham Yost')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cast' }))
      .toHaveTextContent('');
    expect(screen.getByRole('button', { name: 'Crew' }))
      .toHaveTextContent('');

    await user.click(screen.getByRole('button', { name: 'Crew' }));
    await finishToggleTransition();

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
    expect(screen.queryByRole('button', { name: 'Cast' })).not
      .toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Crew' })).not
      .toBeInTheDocument();

    await user.clear(search);

    await waitFor(() => {
      expect(screen.getByText('Crew')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Cast' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crew' })).toBeInTheDocument();
  });

  it('hides episode counts for episode credits', async () => {
    renderComponent(CastDrawerHost, {
      props: {
        crew: EpisodeSiloPeopleMappedMock,
        type: 'episode',
        onClose: vi.fn(),
      },
    });

    await waitFor(() => {
      expect(screen.getByRole('searchbox', { name: 'Search people' }))
        .toBeInTheDocument();
    });

    expect(screen.getByRole('heading', {
      name: `Main Cast ${EpisodeSiloPeopleMappedMock.cast.length} people`,
    })).toBeInTheDocument();
    expect(screen.getByRole('heading', {
      name:
        `Supporting Cast ${EpisodeSiloPeopleMappedMock.guestStars.length} person`,
    })).toBeInTheDocument();
    expect(screen.getByText('Sophie Thompson')).toBeInTheDocument();
    expect(screen.queryByText('2 eps.')).not.toBeInTheDocument();
  });

  it('uses Cast as the episode cast header when only supporting cast is available', async () => {
    const crew = {
      ...EpisodeSiloPeopleMappedMock,
      cast: [],
    };

    renderComponent(CastDrawerHost, {
      props: {
        crew,
        type: 'episode',
        onClose: vi.fn(),
      },
    });

    await waitFor(() => {
      expect(screen.getByRole('searchbox', { name: 'Search people' }))
        .toBeInTheDocument();
    });

    expect(screen.getByRole('heading', {
      name: `Cast ${crew.guestStars.length} person`,
    })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Main Cast/ })).not
      .toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Supporting Cast/ })).not
      .toBeInTheDocument();
  });

  it('uses Cast as the movie cast group header', async () => {
    renderComponent(CastDrawerHost, {
      props: {
        crew: MovieHereticPeopleMappedMock,
        type: 'movie',
        onClose: vi.fn(),
      },
    });

    await waitFor(() => {
      expect(screen.getByRole('searchbox', { name: 'Search people' }))
        .toBeInTheDocument();
    });

    expect(screen.getByRole('heading', {
      name: `Cast ${MovieHereticPeopleMappedMock.cast.length} people`,
    })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Main Cast/ })).not
      .toBeInTheDocument();
  });
});
