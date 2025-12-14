import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import {
  useRemoveFromHistory,
  type UseRemoveFromHistoryProps,
} from '$lib/sections/media-actions/remove-from-history/useRemoveFromHistory.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

vi.mock('$lib/stores/useInvalidator.ts');

describe('useRemoveFromHistory', () => {
  const invalidate = vi.fn(() => {});

  beforeEach(() => {
    invalidate.mockReset();

    (useInvalidator as Mock)
      .mockReturnValueOnce({ invalidate }) // 1: useRemoveFromHistory
      .mockReturnValueOnce({ invalidate }); // 2: useRemoveFromHistory -> useTrack -> useUser
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
    };

    runCommonTests(props, InvalidateAction.MarkAsWatched('movie'));
  });

  describe('media type: episode', () => {
    const props = {
      type: 'episode' as const,
      id: 1,
    };

    runCommonTests(props, InvalidateAction.MarkAsWatched('episode'));
  });
});
