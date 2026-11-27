import { MovieLoreVipMappedMock } from '$mocks/data/summary/movie-lore/mapped/MovieLoreVipMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { fireEvent, screen } from '@testing-library/svelte';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MovieLorePreviously from './MovieLorePreviously.svelte';

const spoiler = vi.hoisted(() => ({ isHidden: true }));

vi.mock('$lib/features/spoilers/_internal/useSpoiler.ts', () => ({
  useSpoiler: () => ({ isSpoilerHidden: of(spoiler.isHidden) }),
}));

const DUNE_ID = 287071;

function render({
  watchedIds,
  onReveal = vi.fn(),
}: {
  watchedIds: ReadonlySet<number>;
  onReveal?: () => void;
}) {
  return renderComponent(MovieLorePreviously, {
    props: {
      previously: MovieLoreVipMappedMock.previously,
      movie: { id: 537449, title: 'Dune: Part Two' },
      watchedIds,
      onReveal,
    },
  });
}

describe('MovieLorePreviously', () => {
  beforeEach(() => {
    spoiler.isHidden = true;
  });

  it('should hide the recap of an earlier film the viewer has not watched', async () => {
    render({ watchedIds: new Set() });

    expect(
      await screen.findByText("You haven't seen Dune. This spoils it."),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Show it anyway' })).toBeTruthy();
  });

  it('should show the recap of an unwatched film when the account shows spoilers', async () => {
    spoiler.isHidden = false;
    render({ watchedIds: new Set() });

    expect(await screen.findByText('Dune')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Show it anyway' })).toBeNull();
    expect(
      screen.queryByText("You haven't seen Dune. This spoils it."),
    ).toBeNull();
  });

  it('should show the recap of an earlier film the viewer has watched', async () => {
    render({ watchedIds: new Set([DUNE_ID]) });

    expect(await screen.findByText('Dune')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Show it anyway' })).toBeNull();
  });

  it('should reveal the recap on request and report it', async () => {
    const onReveal = vi.fn();
    render({ watchedIds: new Set(), onReveal });

    await fireEvent.click(
      await screen.findByRole('button', { name: 'Show it anyway' }),
    );

    expect(onReveal).toHaveBeenCalledOnce();
    expect(screen.queryByRole('button', { name: 'Show it anyway' })).toBeNull();
  });

  it('should end on the movie the recap leads up to', async () => {
    render({ watchedIds: new Set([DUNE_ID]) });

    expect(
      await screen.findByText('Up next: Dune: Part Two, spoiler-free'),
    ).toBeTruthy();
  });
});
