import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, within } from '@testing-library/svelte';
import type { Observable } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MovieLoreWatchFirst from './MovieLoreWatchFirst.svelte';

vi.mock('../useLoreMovieEntry.ts', async () => {
  const { map } = await import('rxjs');
  const { MovieHereticMappedMock: entry } = await import(
    '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts'
  );

  return {
    useLoreMovieEntry: (slug$: Observable<string>) =>
      slug$.pipe(
        map((slug) => ({
          ...entry,
          slug,
          id: slug.length,
          title: slug.charAt(0).toUpperCase() + slug.slice(1),
        })),
      ),
  };
});

const THREE = {
  id: 3,
  slug: 'three',
  title: 'Three',
  year: 2018,
  poster: null,
};
const FOUR = { id: 4, slug: 'four', title: 'Four', year: 2019, poster: null };

const WATCH_FIRST = {
  verdict: 'helpful' as const,
  note: 'The last two set this one up.',
  movies: [THREE],
};

function render({
  watchedIds = new Set<number>(),
}: {
  watchedIds?: ReadonlySet<number>;
} = {}) {
  return renderComponent(MovieLoreWatchFirst, {
    props: {
      watchFirst: WATCH_FIRST,
      earlier: [THREE, FOUR],
      movie: { ...MovieHereticMappedMock, title: 'Five' },
      mustWatchIds: new Set([THREE.id]),
      watchedIds,
    },
  });
}

describe('MovieLoreWatchFirst', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should show the verdict and its note above the posters', async () => {
    render();

    expect(await screen.findByText('The earlier films help')).toBeTruthy();
    expect(screen.getByText('The last two set this one up.')).toBeTruthy();
    expect(screen.getByText('Do I need the films first?')).toBeTruthy();
  });

  it('should tag each poster as must watch or optional and end on this film', async () => {
    render();

    expect(await screen.findByText('Must watch')).toBeTruthy();
    expect(screen.getByText('Optional')).toBeTruthy();
    expect(screen.getByText('This film')).toBeTruthy();
    expect(screen.getByText('Three')).toBeTruthy();
    expect(screen.getByText('Four')).toBeTruthy();
    expect(screen.getByText('Five')).toBeTruthy();
  });

  it('should mark the posters of the films the viewer has seen', async () => {
    const { container } = render({ watchedIds: new Set([FOUR.id]) });

    await screen.findByText('Four');

    expect(
      container.querySelectorAll(
        'trakt-indicator-tag[data-indicator="watched"]',
      ),
    ).toHaveLength(1);
  });

  it('should give every earlier film its action menu but not this film', async () => {
    render();

    expect(
      await screen.findByRole('button', { name: 'Pop up menu for "Three"' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Pop up menu for "Four"' }),
    ).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: 'Pop up menu for "Five"' }),
    ).toBeNull();
  });

  it('should leave out the posters without earlier films', async () => {
    const { container } = renderComponent(MovieLoreWatchFirst, {
      props: {
        watchFirst: { ...WATCH_FIRST, verdict: 'not_needed', movies: [] },
        earlier: [],
        movie: MovieHereticMappedMock,
        mustWatchIds: new Set<number>(),
        watchedIds: new Set<number>(),
      },
    });

    expect(await screen.findByText('Works on its own')).toBeTruthy();
    expect(container.querySelector('.watch-first-films')).toBeNull();
    expect(within(container).queryByText('This film')).toBeNull();
  });
});
