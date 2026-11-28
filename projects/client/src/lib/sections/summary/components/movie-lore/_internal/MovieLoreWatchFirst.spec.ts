import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import MovieLoreWatchFirst from './MovieLoreWatchFirst.svelte';

const MOVIES = [
  { id: 3, slug: 'three', title: 'Three', year: 2018, poster: null },
  { id: 4, slug: 'four', title: 'Four', year: 2019, poster: null },
];

const WATCH_FIRST = {
  verdict: 'helpful' as const,
  note: 'The last two set this one up.',
  movies: MOVIES,
};

describe('MovieLoreWatchFirst', () => {
  it('should label a shorter list and point to the full recap', async () => {
    renderComponent(MovieLoreWatchFirst, {
      props: {
        watchFirst: WATCH_FIRST,
        watchedIds: new Set<number>(),
        earlierCount: 4,
      },
    });

    expect(await screen.findByText('Most important to watch')).toBeTruthy();
    expect(screen.getByText('2 of 4 earlier films')).toBeTruthy();
    expect(
      screen.getByText('All 4 are recapped under Previously on the Lore tab.'),
    ).toBeTruthy();
  });

  it('should leave the list unlabelled when it covers every earlier film', async () => {
    renderComponent(MovieLoreWatchFirst, {
      props: {
        watchFirst: WATCH_FIRST,
        watchedIds: new Set<number>(),
        earlierCount: 2,
      },
    });

    expect(await screen.findByText('Three')).toBeTruthy();
    expect(screen.queryByText('Most important to watch')).toBeNull();
  });
});
