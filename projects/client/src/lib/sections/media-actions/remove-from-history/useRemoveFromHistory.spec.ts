import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import {
  useRemoveFromHistory,
  type UseRemoveFromHistoryProps,
} from '$lib/sections/media-actions/remove-from-history/useRemoveFromHistory.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

vi.mock('$lib/stores/useInvalidator.ts');

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
    };

    runCommonTests(props, InvalidateAction.MarkAsWatched('movie'));

    it('should remove the orphaned rating when removing the last watch', async () => {
      const { removeFromHistory } = await renderStore(() =>
        useRemoveFromHistory({
          type: 'movie' as const,
          id: 42,
          // Heretic (916302): single play in history, carries a rating.
          movie: { id: 916302 },
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
    };

    runCommonTests(props, InvalidateAction.MarkAsWatched('episode'));
  });
});
