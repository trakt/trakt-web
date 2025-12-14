import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock.ts';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useWatchlist } from './useWatchlist.ts';

vi.mock('$lib/stores/useInvalidator.ts');

describe('useWatchlist', () => {
  const invalidate = vi.fn(() => {});

  beforeEach(() => {
    setAuthorization(true);
    invalidate.mockReset();

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
});
