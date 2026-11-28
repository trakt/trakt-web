import type { LoreMovie } from '$lib/requests/models/LoreMovie.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MovieLoreProgress from './MovieLoreProgress.svelte';
import { toLoreProgress } from './toLoreProgress.ts';

function movie(id: number): LoreMovie {
  return {
    id,
    slug: `movie-${id}`,
    title: `Movie ${id}`,
    year: 2000 + id,
    poster: null,
  };
}

const EARLIER = [movie(1), movie(2), movie(3)];

function progressFor({
  mustWatchIds,
  watchedIds = new Set<number>(),
  earlier = EARLIER,
}: {
  mustWatchIds: ReadonlyArray<number>;
  watchedIds?: ReadonlySet<number>;
  earlier?: ReadonlyArray<LoreMovie>;
}) {
  return toLoreProgress({
    earlier,
    mustWatchIds: new Set(mustWatchIds),
    watchedIds,
  });
}

describe('MovieLoreProgress', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should count the must-watch films the viewer has seen and how many are left', async () => {
    renderComponent(MovieLoreProgress, {
      props: {
        progress: progressFor({
          mustWatchIds: [1, 2],
          watchedIds: new Set([1]),
        }),
        title: 'Four',
      },
    });

    expect(
      await screen.findByText("You've seen 1 of 2 must-watch"),
    ).toBeTruthy();
    expect(screen.getByText('1 to go')).toBeTruthy();
    expect(screen.getByText('Must watch 1/2 · Optional 0/1')).toBeTruthy();
    expect(screen.queryByText("You're ready for Four.")).toBeNull();
  });

  it('should say the viewer is caught up once every must-watch film is seen', async () => {
    renderComponent(MovieLoreProgress, {
      props: {
        progress: progressFor({
          mustWatchIds: [1, 2],
          watchedIds: new Set([1, 2]),
        }),
        title: 'Four',
      },
    });

    expect(await screen.findByText('All caught up')).toBeTruthy();
    expect(screen.getByText("You're ready for Four.")).toBeTruthy();
    expect(screen.queryByText(/to go$/)).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('should offer to add every must-watch film that is left to the watchlist', async () => {
    renderComponent(MovieLoreProgress, {
      props: {
        progress: progressFor({ mustWatchIds: [1, 2, 3] }),
        title: 'Four',
      },
    });

    expect(
      await screen.findByRole('button', { name: 'Add all 3 to watchlist' }),
    ).toBeTruthy();
  });

  it('should say it for the last must-watch film and both for the last two', async () => {
    const { unmount } = renderComponent(MovieLoreProgress, {
      props: {
        progress: progressFor({
          mustWatchIds: [1, 2],
          watchedIds: new Set([1]),
        }),
        title: 'Four',
      },
    });

    expect(
      await screen.findByRole('button', { name: 'Add it to watchlist' }),
    ).toBeTruthy();

    unmount();

    renderComponent(MovieLoreProgress, {
      props: {
        progress: progressFor({ mustWatchIds: [1, 2] }),
        title: 'Four',
      },
    });

    expect(
      await screen.findByRole('button', { name: 'Add both to watchlist' }),
    ).toBeTruthy();
  });

  it('should only count the optional films when none is must-watch', async () => {
    renderComponent(MovieLoreProgress, {
      props: {
        progress: progressFor({ mustWatchIds: [] }),
        title: 'Four',
      },
    });

    expect(await screen.findByText('No must-watch films')).toBeTruthy();
    expect(screen.getByText('Optional 0/3')).toBeTruthy();
    expect(screen.queryByText('All caught up')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('should draw the must-watch films before the optional ones and fill what is seen', async () => {
    const { container } = renderComponent(MovieLoreProgress, {
      props: {
        progress: progressFor({
          mustWatchIds: [2, 3],
          watchedIds: new Set([1, 3]),
        }),
        title: 'Four',
      },
    });

    await screen.findByText("You've seen 1 of 2 must-watch");

    const steps = Array.from(container.querySelectorAll('.progress-step')).map(
      (step) =>
        `${step.getAttribute('data-group')}:${step.getAttribute('data-state')}`,
    );

    expect(steps).to.deep.equal([
      'must-watch:unseen',
      'must-watch:seen',
      'optional:seen',
    ]);
  });

  it('should hold the card with placeholders while the watch history loads', async () => {
    const { container } = renderComponent(MovieLoreProgress, {
      props: {
        progress: progressFor({ mustWatchIds: [1, 2] }),
        title: 'Four',
        isLoading: true,
      },
    });

    await vi.waitFor(() =>
      expect(container.querySelectorAll('.trakt-skeleton')).toHaveLength(3),
    );
    expect(container.querySelectorAll('.progress-step')).toHaveLength(3);
    expect(screen.queryByText("You've seen 0 of 2 must-watch")).toBeNull();
    expect(screen.queryByText('2 to go')).toBeNull();
  });

  it('should only count the films for a signed-out viewer', async () => {
    setAuthorization(false);

    const { container } = renderComponent(MovieLoreProgress, {
      props: {
        progress: progressFor({ mustWatchIds: [1, 2] }),
        title: 'Four',
      },
    });

    expect(
      await screen.findByText('2 must-watch films, 1 optional'),
    ).toBeTruthy();
    expect(container.querySelectorAll('.progress-step')).toHaveLength(0);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
