import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import MovieLoreProgress from './MovieLoreProgress.svelte';
import { toLoreProgress } from './toLoreProgress.ts';

const EARLIER = [
  { id: 1, slug: 'one', title: 'One', year: 2001, poster: null },
  { id: 2, slug: 'two', title: 'Two', year: 2003, poster: null },
];

describe('MovieLoreProgress', () => {
  it('should count the earlier films the viewer has seen and name the next one', async () => {
    renderComponent(MovieLoreProgress, {
      props: {
        progress: toLoreProgress({
          earlier: EARLIER,
          watchedIds: new Set([1]),
        }),
        verdict: 'helpful',
        title: 'Three',
      },
    });

    expect(
      await screen.findByText("You've seen 1 of 2 earlier films"),
    ).toBeTruthy();
    expect(screen.getByText('The earlier films help')).toBeTruthy();
    expect(screen.getByText('Next up: Two (2003)')).toBeTruthy();
  });

  it('should say the viewer is ready once every earlier film is seen', async () => {
    renderComponent(MovieLoreProgress, {
      props: {
        progress: toLoreProgress({
          earlier: EARLIER,
          watchedIds: new Set([1, 2]),
        }),
        verdict: undefined,
        title: 'Three',
      },
    });

    expect(await screen.findByText("You're ready for Three.")).toBeTruthy();
  });

  it('should use the singular for a single earlier film', async () => {
    renderComponent(MovieLoreProgress, {
      props: {
        progress: toLoreProgress({
          earlier: EARLIER.slice(0, 1),
          watchedIds: new Set(),
        }),
        verdict: 'required',
        title: 'Two',
      },
    });

    expect(
      await screen.findByText("You've seen 0 of 1 earlier film"),
    ).toBeTruthy();
  });
});
