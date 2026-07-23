import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock.ts';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { lastActionToast } from '$test/beds/action-toast/lastActionToast.ts';
import { captureRequests } from '$test/beds/request/captureRequests.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useWatchlist } from './useWatchlist.ts';

vi.mock('$lib/stores/useInvalidator.ts');

const { notify } = vi.hoisted(() => ({ notify: vi.fn() }));
vi.mock('$lib/features/action-toast/useActionToast.ts', () => ({
  useActionToast: () => ({ notify, dismiss: vi.fn() }),
}));

describe('useWatchlist', () => {
  const invalidate = vi.fn(function () {});

  beforeEach(() => {
    setAuthorization(true);
    invalidate.mockReset();
    notify.mockReset();

    (useInvalidator as Mock)
      .mockReturnValueOnce({ invalidate }) // 1: in useWatchlist
      .mockReturnValueOnce({ invalidate }) // 2: in useWatchlist -> useTrack -> useUser
      .mockReturnValueOnce({ invalidate }); // 3: in useWatchlist -> useIsWatchlisted -> useUser
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

      await addToWatchlist();
      expect(invalidate).toHaveBeenCalledWith(invalidation);
    });

    it('should call invalidate after removing from watchlist', async () => {
      const { removeFromWatchlist } = await renderStore(() =>
        useWatchlist(props)
      );

      await removeFromWatchlist();
      expect(invalidate).toHaveBeenCalledWith(invalidation);
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

  describe('action confirmation undo', () => {
    it('should re-add to the watchlist when the removal toast Undo runs', async () => {
      const { removeFromWatchlist } = await renderStore(() =>
        useWatchlist({ type: 'movie', media: MovieMatrixMappedMock })
      );

      const removeRequests = await captureRequests(() => removeFromWatchlist());
      expect(removeRequests).toContain('POST /sync/watchlist/remove');

      const toast = lastActionToast(notify);
      expect(toast?.action).toBeDefined();

      const undoRequests = await captureRequests(async () => {
        await toast?.action?.onAction();
      });
      expect(undoRequests).toContain('POST /sync/watchlist');
      expect(undoRequests).not.toContain('POST /sync/watchlist/remove');
    });
  });
});
