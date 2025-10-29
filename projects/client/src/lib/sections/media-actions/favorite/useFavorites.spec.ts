import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock.ts';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { type FavoritesStoreProps, useFavorites } from './useFavorites.ts';

vi.mock('$lib/stores/useInvalidator.ts');

describe('useFavorites', () => {
  const invalidate = vi.fn(() => {});

  beforeEach(() => {
    setAuthorization(true);
    invalidate.mockReset();

    (useInvalidator as Mock)
      .mockReturnValueOnce({ invalidate }) // 1: useFavorites
      .mockReturnValueOnce({ invalidate }); // 2: useFavorites -> useUser
  });

  const runCommonTests = (props: FavoritesStoreProps, invalidation: string) => {
    it('should NOT be updating favorites when first requested', async () => {
      const { isUpdatingFavorite } = await renderStore(() =>
        useFavorites(props)
      );

      expect(get(isUpdatingFavorite)).toBe(false);
    });

    it('should be updating favorites when adding', async () => {
      const { isUpdatingFavorite, addToFavorites } = await renderStore(() =>
        useFavorites(props)
      );

      addToFavorites();
      expect(get(isUpdatingFavorite)).toBe(true);
    });

    it('should NOT be updating favorites after add request is completed', async () => {
      const { isUpdatingFavorite, addToFavorites } = await renderStore(() =>
        useFavorites(props)
      );

      await addToFavorites();
      expect(get(isUpdatingFavorite)).toBe(false);
    });

    it('should be updating favorites when removing', async () => {
      const { isUpdatingFavorite, removeFromFavorites } = await renderStore(
        () => useFavorites(props),
      );

      removeFromFavorites();
      expect(get(isUpdatingFavorite)).toBe(true);
    });

    it('should NOT be updating favorites after remove request is completed', async () => {
      const { isUpdatingFavorite, removeFromFavorites } = await renderStore(
        () => useFavorites(props),
      );

      await removeFromFavorites();
      expect(get(isUpdatingFavorite)).toBe(false);
    });

    it('should call invalidate after adding to favorites', async () => {
      const { addToFavorites } = await renderStore(() => useFavorites(props));

      await addToFavorites();
      expect(invalidate).toHaveBeenCalledWith(invalidation);
    });

    it('should call invalidate after removing from favorites', async () => {
      const { removeFromFavorites } = await renderStore(() =>
        useFavorites(props)
      );

      await removeFromFavorites();
      expect(invalidate).toHaveBeenCalledWith(invalidation);
    });

    it('should NOT be favorited', async () => {
      const { isFavorited } = await renderStore(() => useFavorites(props));

      expect(await waitForEmission(isFavorited, 2)).toBe(false);
    });
  };

  describe('media type: movie', () => {
    const props = {
      type: 'movie' as const,
      id: 1,
      title: 'Some Movie',
    };

    runCommonTests(props, InvalidateAction.Favorited('movie'));

    it('should know Heretic is favorited', async () => {
      const { isFavorited } = await renderStore(() =>
        useFavorites({ ...props, id: MovieHereticMappedMock.id })
      );

      expect(await waitForEmission(isFavorited, 2)).toBe(true);
    });

    it('should NOT be favorited if it is The Matrix', async () => {
      const { isFavorited } = await renderStore(() =>
        useFavorites({ ...props, id: MovieMatrixMappedMock.id })
      );

      expect(await waitForEmission(isFavorited, 2)).toBe(false);
    });
  });

  describe('media type: show', () => {
    const props = {
      type: 'show' as const,
      id: 1,
      title: 'Some Show',
    };

    runCommonTests(props, InvalidateAction.Favorited('show'));

    it('should know Silo is favorited', async () => {
      const { isFavorited } = await renderStore(() =>
        useFavorites({ ...props, id: ShowSiloMappedMock.id })
      );

      expect(await waitForEmission(isFavorited, 2)).toBe(true);
    });

    it('should NOT be favorited if it is Devs', async () => {
      const { isFavorited } = await renderStore(() =>
        useFavorites({ ...props, id: ShowDevsMappedMock.id })
      );

      expect(await waitForEmission(isFavorited, 2)).toBe(false);
    });
  });
});
