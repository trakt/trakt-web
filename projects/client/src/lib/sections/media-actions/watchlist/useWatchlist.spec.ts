import { m } from '$lib/features/i18n/messages.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock.ts';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { lastActionToast } from '$test/beds/action-toast/lastActionToast.ts';
import { server } from '$mocks/server.ts';
import { captureInvalidations } from '$test/beds/query/captureInvalidations.ts';
import { captureRequests } from '$test/beds/request/captureRequests.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { setAuthorization } from '$test/beds/store/setAuthorization.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { http, HttpResponse } from 'msw';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWatchlist } from './useWatchlist.ts';

const { notify } = vi.hoisted(() => ({ notify: vi.fn() }));
vi.mock('$lib/features/action-toast/useActionToast.ts', () => ({
  useActionToast: () => ({ notify, dismiss: vi.fn() }),
}));

describe('useWatchlist', () => {
  beforeEach(() => {
    setAuthorization(true);
    notify.mockReset();
  });

  const runCommonTests = (props: MediaStoreProps, invalidation: string) => {
    it('should NOT be updating watchlist when first requested', async () => {
      const { isWatchlistUpdating } = await renderStore(() =>
        useWatchlist(props)
      );

      expect(await firstValueFrom(isWatchlistUpdating)).toBe(false);
    });

    it('should be updating watchlist when adding', async () => {
      const { isWatchlistUpdating, addToWatchlist } = await renderStore(() =>
        useWatchlist(props)
      );

      addToWatchlist();
      expect(await firstValueFrom(isWatchlistUpdating)).toBe(true);
    });

    it('should NOT be updating watchlist after add request is completed', async () => {
      const { isWatchlistUpdating, addToWatchlist } = await renderStore(() =>
        useWatchlist(props)
      );

      await addToWatchlist();
      expect(await firstValueFrom(isWatchlistUpdating)).toBe(false);
    });

    it('should be updating watchlist when removing', async () => {
      const { isWatchlistUpdating, removeFromWatchlist } = await renderStore(
        () => useWatchlist(props),
      );

      removeFromWatchlist();
      expect(await firstValueFrom(isWatchlistUpdating)).toBe(true);
    });

    it('should NOT be updating watchlist after remove request is completed', async () => {
      const { isWatchlistUpdating, removeFromWatchlist } = await renderStore(
        () => useWatchlist(props),
      );

      await removeFromWatchlist();
      expect(await firstValueFrom(isWatchlistUpdating)).toBe(false);
    });

    it('should call invalidate after adding to watchlist', async () => {
      const { addToWatchlist } = await renderStore(() => useWatchlist(props));

      const invalidations = await captureInvalidations(addToWatchlist);

      expect(invalidations).toContain(invalidation);
    });

    it('should call invalidate after removing from watchlist', async () => {
      const { removeFromWatchlist } = await renderStore(() =>
        useWatchlist(props)
      );

      const invalidations = await captureInvalidations(removeFromWatchlist);

      expect(invalidations).toContain(invalidation);
    });

    it('should NOT be watchlisted', async () => {
      const { isWatchlisted } = await renderStore(() => useWatchlist(props));

      expect(await waitForEmission(isWatchlisted, 2)).toBe(false);
    });
  };

  describe('media type: movie', () => {
    const props = {
      type: 'movie' as const,
      media: { id: 1 },
    };

    runCommonTests(props, InvalidateAction.Watchlisted('movie'));

    it('should know The Matrix is watchlisted', async () => {
      const { isWatchlisted } = await renderStore(() =>
        useWatchlist({ ...props, media: MovieMatrixMappedMock })
      );

      expect(await waitForEmission(isWatchlisted, 2)).toBe(true);
    });
  });

  describe('media type: show', () => {
    const props = {
      type: 'show' as const,
      media: { id: 1 },
    };

    runCommonTests(props, InvalidateAction.Watchlisted('show'));

    it('should be watchlisted if it is Silo', async () => {
      const { isWatchlisted } = await renderStore(() =>
        useWatchlist({ ...props, media: ShowSiloMappedMock })
      );

      expect(await waitForEmission(isWatchlisted, 2)).toBe(true);
    });

    it('should NOT be watchlisted if it is Devs', async () => {
      const { isWatchlisted } = await renderStore(() =>
        useWatchlist({ ...props, media: ShowDevsMappedMock })
      );

      expect(await waitForEmission(isWatchlisted, 2)).toBe(false);
    });
  });

  describe('lists drawer', () => {
    it('should NOT raise an action toast when toasts are disabled', async () => {
      const { addToWatchlist, removeFromWatchlist } = await renderStore(() =>
        useWatchlist({
          type: 'movie',
          media: MovieMatrixMappedMock,
          isToastEnabled: false,
        })
      );

      await addToWatchlist();
      await removeFromWatchlist();

      expect(notify).not.toHaveBeenCalled();
    });
  });

  describe('action confirmation', () => {
    it('should NOT raise an action toast on removal', async () => {
      const { removeFromWatchlist } = await renderStore(() =>
        useWatchlist({ type: 'movie', media: MovieMatrixMappedMock })
      );

      await removeFromWatchlist();

      expect(notify).not.toHaveBeenCalled();
    });

    it('should offer to change the list when adding', async () => {
      const { addToWatchlist } = await renderStore(() =>
        useWatchlist({ type: 'movie', media: MovieMatrixMappedMock })
      );

      const addRequests = await captureRequests(() => addToWatchlist());
      expect(addRequests).toContain('POST /sync/watchlist');

      expect(lastActionToast(notify)?.action?.text).toBe(
        m.action_toast_action_change_list(),
      );
    });

    it('should NOT raise an action toast when the addition is queued offline', async () => {
      server.use(
        http.post(
          'http://localhost/sync/watchlist',
          () => HttpResponse.error(),
        ),
      );

      const { addToWatchlist } = await renderStore(() =>
        useWatchlist({
          type: 'movie',
          media: { ...MovieMatrixMappedMock, id: 999_998 },
        })
      );

      await addToWatchlist();

      expect(notify).not.toHaveBeenCalled();
    });
  });
});
