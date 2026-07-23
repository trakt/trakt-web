import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import {
  useRemoveFromHistory,
  type UseRemoveFromHistoryProps,
} from '$lib/sections/media-actions/remove-from-history/useRemoveFromHistory.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { lastActionToast } from '$test/beds/action-toast/lastActionToast.ts';
import { captureRequests } from '$test/beds/request/captureRequests.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

vi.mock('$lib/stores/useInvalidator.ts');

const { notify } = vi.hoisted(() => ({ notify: vi.fn() }));
vi.mock('$lib/features/action-toast/useActionToast.ts', () => ({
  useActionToast: () => ({ notify, dismiss: vi.fn() }),
}));

const removeRatingSpy = vi.fn((_body?: unknown) => Promise.resolve(true));
vi.mock('$lib/requests/sync/removeRatingRequest.ts', () => ({
  removeRatingRequest: (body: unknown) => removeRatingSpy(body),
}));
vi.mock('$lib/requests/sync/removeWatchedRequest.ts', () => ({
  removeWatchedRequest: () => Promise.resolve(true),
}));

describe('useRemoveFromHistory', () => {
  const invalidate = vi.fn(function () {});

  beforeEach(() => {
    setAuthorization(true);
    invalidate.mockReset();
    removeRatingSpy.mockClear();
    notify.mockReset();

    (useInvalidator as Mock).mockReturnValue({ invalidate });
  });

  const runCommonTests = (
    props: UseRemoveFromHistoryProps,
    invalidation: string,
  ) => {
    it('should NOT be removing when first requested', async () => {
      const { isRemoving } = await renderStore(() =>
        useRemoveFromHistory(props)
      );

      expect(await firstValueFrom(isRemoving)).toBe(false);
    });

    it('should be marking as removing when removing', async () => {
      const { isRemoving, removeFromHistory } = await renderStore(() =>
        useRemoveFromHistory(props)
      );

      removeFromHistory();
      expect(await firstValueFrom(isRemoving)).toBe(true);
    });

    it('should call invalidate after removing', async () => {
      const { removeFromHistory } = await renderStore(() =>
        useRemoveFromHistory(props)
      );

      await removeFromHistory();
      expect(invalidate).toHaveBeenCalledWith(invalidation);
    });
  };

  describe('media type: movie', () => {
    const props = {
      type: 'movie' as const,
      id: 1,
      movie: { id: 1 },
      watchedAt: new Date('2026-08-01T20:00:00.000Z'),
    };

    runCommonTests(props, InvalidateAction.MarkAsWatched('movie'));

    it('should remove the orphaned rating when removing the last watch', async () => {
      const { removeFromHistory } = await renderStore(() =>
        useRemoveFromHistory({
          type: 'movie' as const,
          id: 42,
          // Heretic (916302): single play in history, carries a rating.
          movie: { id: 916302 },
          watchedAt: new Date('2026-08-01T20:00:00.000Z'),
        })
      );

      await removeFromHistory();

      expect(removeRatingSpy).toHaveBeenCalledWith({
        body: { movies: [{ ids: { trakt: 916302 } }] },
      });
    });

    it('should NOT remove a rating for an unrated movie', async () => {
      const { removeFromHistory } = await renderStore(() =>
        useRemoveFromHistory(props)
      );

      await removeFromHistory();

      expect(removeRatingSpy).not.toHaveBeenCalled();
    });
  });

  describe('media type: episode', () => {
    const props = {
      type: 'episode' as const,
      id: 1,
      episode: { id: 1 },
      show: { id: 1 },
      watchedAt: new Date('2026-08-01T20:00:00.000Z'),
    };

    runCommonTests(props, InvalidateAction.MarkAsWatched('episode'));
  });

  describe('inline trigger', () => {
    it('should NOT raise an action toast when toasts are disabled', async () => {
      const { removeFromHistory } = await renderStore(() =>
        useRemoveFromHistory({
          type: 'movie' as const,
          id: 1,
          movie: { id: 1 },
          watchedAt: new Date('2026-08-01T20:00:00.000Z'),
          isToastEnabled: false,
        })
      );

      await removeFromHistory();

      expect(notify).not.toHaveBeenCalled();
    });
  });

  describe('action confirmation undo', () => {
    it('should stop removing when the restore request rejects', async () => {
      const { isRemoving, removeFromHistory } = await renderStore(() =>
        useRemoveFromHistory({
          type: 'movie' as const,
          id: 1,
          movie: { id: 1 },
          watchedAt: new Date('2026-08-01T20:00:00.000Z'),
        })
      );

      await removeFromHistory();

      server.use(
        http.post(
          'http://localhost/sync/history',
          () => HttpResponse.error(),
        ),
      );

      await expect(lastActionToast(notify)?.action?.onAction()).rejects
        .toThrow();

      expect(await firstValueFrom(isRemoving)).toBe(false);
    });

    it('should restore the play at its original date when Undo runs', async () => {
      const { removeFromHistory } = await renderStore(() =>
        useRemoveFromHistory({
          type: 'movie' as const,
          id: 42,
          movie: { id: 916302 },
          watchedAt: new Date('2026-08-01T20:00:00.000Z'),
        })
      );

      await removeFromHistory();

      const toast = lastActionToast(notify);
      expect(toast?.action).toBeDefined();

      const undoRequests = await captureRequests(async () => {
        await toast?.action?.onAction();
      });

      expect(undoRequests).toContain('POST /sync/history');
    });

    it('should restore the orphaned rating when Undo runs', async () => {
      const { removeFromHistory } = await renderStore(() =>
        useRemoveFromHistory({
          type: 'movie' as const,
          id: 42,
          // Heretic (916302): single play in history, carries a rating.
          movie: { id: 916302 },
          watchedAt: new Date('2026-08-01T20:00:00.000Z'),
        })
      );

      await removeFromHistory();

      const undoRequests = await captureRequests(async () => {
        await lastActionToast(notify)?.action?.onAction();
      });

      expect(undoRequests).toContain('POST /sync/ratings');
    });

    it('should NOT restore a rating for an unrated movie', async () => {
      const { removeFromHistory } = await renderStore(() =>
        useRemoveFromHistory({
          type: 'movie' as const,
          id: 1,
          movie: { id: 1 },
          watchedAt: new Date('2026-08-01T20:00:00.000Z'),
        })
      );

      await removeFromHistory();

      const undoRequests = await captureRequests(async () => {
        await lastActionToast(notify)?.action?.onAction();
      });

      expect(undoRequests).not.toContain('POST /sync/ratings');
    });
  });
});
