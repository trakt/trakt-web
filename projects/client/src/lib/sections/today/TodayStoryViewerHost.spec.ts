import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, waitFor, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import TodayStoryViewerHost from './TodayStoryViewerHost.svelte';

const WATCHLIST_MARKER = `trakt-marker:${
  InvalidateAction.Watchlisted(ShowSiloMappedMock.type)
}`;
const REFETCH_SETTLE_MS = 300;

describe('TodayStoryViewerHost', () => {
  beforeEach(() => {
    setAuthorization(true);
    globalThis.localStorage.removeItem(WATCHLIST_MARKER);
    window.history.pushState({}, '', '/?view=today-story');
  });

  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it(
    'should keep the viewer on the same story after a watchlist action',
    async () => {
      const user = userEvent.setup();
      renderComponent(TodayStoryViewerHost, { props: {} });

      await screen.findByRole('dialog', {}, { timeout: 10_000 });
      const [next] = screen.getAllByRole('button', { name: 'Next story' });
      await user.click(assertDefined(next));
      const viewer = await screen.findByRole('dialog', {
        name: ShowSiloMappedMock.title,
      });

      await user.click(
        screen.getByRole('button', {
          name: `Remove "${ShowSiloMappedMock.title}" from your Watchlist`,
        }),
      );
      const confirmation = await screen.findByRole('dialog', { name: '' });
      await user.click(
        within(confirmation).getByRole('button', {
          name: 'Remove from watchlist',
        }),
      );
      await waitFor(() => {
        expect(globalThis.localStorage.getItem(WATCHLIST_MARKER)).not
          .toBeNull();
      });
      await new Promise((resolve) => setTimeout(resolve, REFETCH_SETTLE_MS));

      expect(viewer).toBeInTheDocument();
      expect(screen.getByRole('dialog', { name: ShowSiloMappedMock.title }))
        .toBe(viewer);
    },
    30_000,
  );
});
