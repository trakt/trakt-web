import { useAddNoteDrawer } from '$lib/features/notes/useAddNoteDrawer.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock.ts';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { server } from '$mocks/server.ts';
import { captureInvalidations } from '$test/beds/query/captureInvalidations.ts';
import { respondWithMalformedJson } from '$test/beds/request/respondWithMalformedJson.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { type FavoritesStoreProps, useFavorites } from './useFavorites.ts';

const { track } = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock('$lib/features/notes/useAddNoteDrawer.ts');
vi.mock('$lib/features/analytics/useTrack.ts', () => ({
  useTrack: () => ({ track }),
}));

describe('useFavorites', () => {
  beforeEach(() => {
    track.mockClear();
    setAuthorization(true);

    (useAddNoteDrawer as Mock).mockReturnValue({ open: vi.fn() });
  });

  const runCommonTests = (props: FavoritesStoreProps, invalidation: string) => {
    it('should NOT be updating favorites when first requested', async () => {
      const { isUpdatingFavorite } = await renderStore(() =>
        useFavorites(props),
      );

      expect(await firstValueFrom(isUpdatingFavorite)).toBe(false);
    });

    it('should be updating favorites when adding', async () => {
      const { isUpdatingFavorite, addToFavorites } = await renderStore(() =>
        useFavorites(props),
      );

      addToFavorites();
      expect(await firstValueFrom(isUpdatingFavorite)).toBe(true);
    });

    it('should NOT be updating favorites after add request is completed', async () => {
      const { isUpdatingFavorite, addToFavorites } = await renderStore(() =>
        useFavorites(props),
      );

      await addToFavorites();
      expect(await firstValueFrom(isUpdatingFavorite)).toBe(false);
    });

    it('should be updating favorites when removing', async () => {
      const { isUpdatingFavorite, removeFromFavorites } = await renderStore(
        () => useFavorites(props),
      );

      removeFromFavorites();
      expect(await firstValueFrom(isUpdatingFavorite)).toBe(true);
    });

    it('should NOT be updating favorites after remove request is completed', async () => {
      const { isUpdatingFavorite, removeFromFavorites } = await renderStore(
        () => useFavorites(props),
      );

      await removeFromFavorites();
      expect(await firstValueFrom(isUpdatingFavorite)).toBe(false);
    });

    it('should call invalidate after adding to favorites', async () => {
      const { addToFavorites } = await renderStore(() => useFavorites(props));

      const invalidations = await captureInvalidations(addToFavorites);

      expect(invalidations).toContain(invalidation);
    });

    it('should call invalidate after removing from favorites', async () => {
      const { removeFromFavorites } = await renderStore(() =>
        useFavorites(props),
      );

      const invalidations = await captureInvalidations(removeFromFavorites);

      expect(invalidations).toContain(invalidation);
    });

    it('should NOT be favorited', async () => {
      const { isFavorited } = await renderStore(() => useFavorites(props));

      expect(await waitForEmission(isFavorited, 2)).toBe(false);
    });
  };

  describe('media type: movie', () => {
    const props = {
      type: 'movie' as const,
      title: 'Some Movie',
      id: 1,
    };

    runCommonTests(props, InvalidateAction.Favorited('movie'));

    it('should know Heretic is favorited', async () => {
      const { isFavorited } = await renderStore(() =>
        useFavorites({ ...props, id: MovieHereticMappedMock.id }),
      );

      expect(await waitForEmission(isFavorited, 2)).toBe(true);
    });

    it('should NOT be favorited if it is The Matrix', async () => {
      const { isFavorited } = await renderStore(() =>
        useFavorites({ ...props, id: MovieMatrixMappedMock.id }),
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
        useFavorites({ ...props, id: ShowSiloMappedMock.id }),
      );

      expect(await waitForEmission(isFavorited, 2)).toBe(true);
    });

    it('should NOT be favorited if it is Devs', async () => {
      const { isFavorited } = await renderStore(() =>
        useFavorites({ ...props, id: ShowDevsMappedMock.id }),
      );

      expect(await waitForEmission(isFavorited, 2)).toBe(false);
    });
  });

  describe('pending state', () => {
    it('should show as favorited while an add is in flight', async () => {
      const { isFavorited, addToFavorites } = await renderStore(() =>
        useFavorites({
          type: 'movie',
          id: MovieMatrixMappedMock.id,
          title: MovieMatrixMappedMock.title,
        }),
      );

      expect(await waitForEmission(isFavorited, 2)).toBe(false);

      const addition = addToFavorites();
      expect(await firstValueFrom(isFavorited)).toBe(true);

      await addition;
    });

    it('should show as not favorited while a remove is in flight', async () => {
      const { isFavorited, removeFromFavorites } = await renderStore(() =>
        useFavorites({
          type: 'movie',
          id: MovieHereticMappedMock.id,
          title: MovieHereticMappedMock.title,
        }),
      );

      expect(await waitForEmission(isFavorited, 2)).toBe(true);

      const removal = removeFromFavorites();
      expect(await firstValueFrom(isFavorited)).toBe(false);

      await removal;
    });

    it('should revert to the real state when the add fails', async () => {
      server.use(respondWithMalformedJson('http://localhost/sync/favorites'));

      const { isFavorited, addToFavorites } = await renderStore(() =>
        useFavorites({
          type: 'movie',
          id: MovieMatrixMappedMock.id,
          title: MovieMatrixMappedMock.title,
        }),
      );

      expect(await waitForEmission(isFavorited, 2)).toBe(false);

      const addition = addToFavorites();
      expect(await firstValueFrom(isFavorited)).toBe(true);

      await expect(addition).rejects.toThrow();
      expect(await firstValueFrom(isFavorited)).toBe(false);
    });
  });

  describe('tracking', () => {
    const props = { type: 'movie' as const, id: 1, title: 'Some Movie' };

    it('should track an add', async () => {
      const { addToFavorites } = await renderStore(() => useFavorites(props));

      await addToFavorites();

      expect(track).toHaveBeenCalledExactlyOnceWith({ action: 'add' });
    });

    it('should track a removal', async () => {
      const { removeFromFavorites } = await renderStore(() =>
        useFavorites(props),
      );

      await removeFromFavorites();

      expect(track).toHaveBeenCalledExactlyOnceWith({ action: 'remove' });
    });
  });
});
