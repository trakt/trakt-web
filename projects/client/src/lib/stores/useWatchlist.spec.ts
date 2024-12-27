import { InvalidateAction } from '$lib/requests/models/InvalidateAction';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/ShowSiloMappedMock';
import { renderStore } from '$test/beds/store/renderStore';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { waitFor } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useInvalidator } from './useInvalidator';
import { useWatchlist } from './useWatchlist';

vi.mock('./useInvalidator.ts');

describe('useWatchlist', () => {
  const invalidate = vi.fn(() => {});

  beforeEach(() => {
    invalidate.mockReset();

    (useInvalidator as Mock).mockReturnValueOnce({
      invalidate,
    });
  });

  const runCommonTests = (props: any, invalidation: string) => {
    it('should NOT be updating watchlist when first requested', async () => {
      const { isWatchlistUpdating } = await renderStore(() =>
        useWatchlist(props)
      );

      expect(get(isWatchlistUpdating)).toBe(false);
    });

    it('should be updating watchlist when adding', async () => {
      const { isWatchlistUpdating, addToWatchlist } = await renderStore(() =>
        useWatchlist(props)
      );

      addToWatchlist();
      waitFor(() => expect(get(isWatchlistUpdating)).toBe(true));
    });

    it('should NOT be updating watchlist after add request is completed', async () => {
      const { isWatchlistUpdating, addToWatchlist } = await renderStore(() =>
        useWatchlist(props)
      );

      await addToWatchlist();
      expect(get(isWatchlistUpdating)).toBe(false);
    });

    it('should be updating watchlist when removing', async () => {
      const { isWatchlistUpdating, removeFromWatchlist } = await renderStore(
        () => useWatchlist(props),
      );

      removeFromWatchlist();
      waitFor(() => expect(get(isWatchlistUpdating)).toBe(true));
    });

    it('should NOT be updating watchlist after remove request is completed', async () => {
      const { isWatchlistUpdating, removeFromWatchlist } = await renderStore(
        () => useWatchlist(props),
      );

      await removeFromWatchlist();
      expect(get(isWatchlistUpdating)).toBe(false);
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
