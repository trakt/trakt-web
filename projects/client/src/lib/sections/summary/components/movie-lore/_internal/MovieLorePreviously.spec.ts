import { MovieLoreVipMappedMock } from '$mocks/data/summary/movie-lore/mapped/MovieLoreVipMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { fireEvent, screen } from '@testing-library/svelte';
import { type Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MovieLorePreviously from './MovieLorePreviously.svelte';

const spoiler = vi.hoisted(() => ({ isHidden: true }));

vi.mock('$lib/features/spoilers/_internal/useSpoiler.ts', () => ({
  useSpoiler: () => ({ isSpoilerHidden: of(spoiler.isHidden) }),
}));

vi.mock('../useLoreMovieEntry.ts', async () => {
  const { map: toEntry } = await import('rxjs');
  const { MovieHereticMappedMock: entry } = await import(
    '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts'
  );

  return {
    useLoreMovieEntry: (slug$: Observable<string>) =>
      slug$.pipe(toEntry((slug) => ({ ...entry, slug }))),
  };
});

const DUNE_ID = 287071;
const SHOW_DUNE = 'Show the recap of Dune, spoils this film';
const DUNE_RECAP = 'Duke Leto Atreides';

function render({
  watchedIds,
  mustWatchIds = new Set<number>(),
  onReveal = vi.fn(),
}: {
  watchedIds: ReadonlySet<number>;
  mustWatchIds?: ReadonlySet<number>;
  onReveal?: () => void;
}) {
  return renderComponent(MovieLorePreviously, {
    props: {
      previously: MovieLoreVipMappedMock.previously,
      movie: { id: 537449, title: 'Dune: Part Two' },
      mustWatchIds,
      watchedIds,
      onReveal,
    },
  });
}

describe('MovieLorePreviously', () => {
  beforeEach(() => {
    spoiler.isHidden = true;
  });

  it('should keep the recap of an earlier film the viewer has not watched collapsed behind a show button', async () => {
    render({ watchedIds: new Set() });

    const show = await screen.findByRole('button', { name: SHOW_DUNE });

    expect(show).toBeTruthy();
    expect(screen.getByTitle('Spoils this film')).toBeTruthy();
    expect(screen.getByText('Dune')).toBeTruthy();
    expect(screen.queryByText(DUNE_RECAP)).toBeNull();
  });

  it('should open the recap in place when the viewer shows it and report it', async () => {
    const onReveal = vi.fn();
    render({ watchedIds: new Set(), onReveal });

    await fireEvent.click(
      await screen.findByRole('button', { name: SHOW_DUNE }),
    );

    expect(onReveal).toHaveBeenCalledOnce();
    expect(await screen.findByText(DUNE_RECAP)).toBeTruthy();
    expect(screen.queryByRole('button', { name: SHOW_DUNE })).toBeNull();
  });

  it('should show the recap of an unwatched film when the account shows spoilers', async () => {
    spoiler.isHidden = false;
    render({ watchedIds: new Set() });

    expect(await screen.findByText(DUNE_RECAP)).toBeTruthy();
    expect(screen.queryByRole('button', { name: SHOW_DUNE })).toBeNull();
  });

  it('should show the recap of an earlier film the viewer has watched and tick its poster', async () => {
    const { container } = render({ watchedIds: new Set([DUNE_ID]) });

    expect(await screen.findByText(DUNE_RECAP)).toBeTruthy();
    expect(screen.queryByRole('button', { name: SHOW_DUNE })).toBeNull();
    expect(
      container.querySelectorAll(
        'trakt-indicator-tag[data-indicator="watched"]',
      ),
    ).toHaveLength(1);
  });

  it('should tag an unseen must-watch film and leave the other films untagged', async () => {
    const { unmount } = render({
      watchedIds: new Set(),
      mustWatchIds: new Set([DUNE_ID]),
    });

    expect(await screen.findByText('Must watch')).toBeTruthy();

    unmount();

    render({ watchedIds: new Set(), mustWatchIds: new Set() });

    await screen.findByText('Dune');

    expect(screen.queryByText('Must watch')).toBeNull();
    expect(screen.queryByText('Optional')).toBeNull();
  });

  it('should drop the tag once the must-watch film is seen', async () => {
    render({
      watchedIds: new Set([DUNE_ID]),
      mustWatchIds: new Set([DUNE_ID]),
    });

    await screen.findByText('Dune');

    expect(screen.queryByText('Must watch')).toBeNull();
  });

  it('should give each earlier film an action menu when signed in', async () => {
    setAuthorization(true);
    render({ watchedIds: new Set() });

    expect(
      await screen.findByRole('button', { name: 'Pop up menu for "Dune"' }),
    ).toBeTruthy();
  });

  it('should end on the movie the recap leads up to', async () => {
    render({ watchedIds: new Set([DUNE_ID]) });

    expect(await screen.findByText('Up next: Dune: Part Two')).toBeTruthy();
  });
});
