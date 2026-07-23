import type { ActionToast } from '$lib/features/action-toast/models/ActionToast.ts';
import { useAddNoteDrawer } from '$lib/features/notes/useAddNoteDrawer.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock.ts';
import { server } from '$mocks/server.ts';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { type FavoritesStoreProps, useFavorites } from './useFavorites.ts';

vi.mock('$lib/stores/useInvalidator.ts');
vi.mock('$lib/features/notes/useAddNoteDrawer.ts');

// Capture what the hook hands to the toast engine so the test can invoke the
// "Undo" action exactly as the toast host would.
const { notify } = vi.hoisted(() => ({ notify: vi.fn() }));
vi.mock('$lib/features/action-toast/useActionToast.ts', () => ({
  useActionToast: () => ({ notify, dismiss: vi.fn() }),
}));

/** Records request method + path for every request MSW handles during `run`. */
async function captureRequests(run: () => Promise<void>): Promise<string[]> {
  const requests: string[] = [];
  const record = ({ request }: { request: Request }) => {
    requests.push(`${request.method} ${new URL(request.url).pathname}`);
  };

  server.events.on('request:start', record);
  try {
    await run();
  } finally {
    server.events.removeListener('request:start', record);
  }
  return requests;
}

describe('useFavorites', () => {
  const invalidate = vi.fn(function () {});

  beforeEach(() => {
    setAuthorization(true);
    invalidate.mockReset();
    notify.mockReset();

    (useInvalidator as Mock)
      .mockReturnValueOnce({ invalidate }) // 1: useFavorites
      .mockReturnValueOnce({ invalidate }); // 2: useFavorites -> useUser

    (useAddNoteDrawer as Mock).mockReturnValue({ open: vi.fn() });
  });

  const runCommonTests = (props: FavoritesStoreProps, invalidation: string) => {
    it('should NOT be updating favorites when first requested', async () => {
      const { isUpdatingFavorite } = await renderStore(() =>
        useFavorites(props)
      );

      expect(await firstValueFrom(isUpdatingFavorite)).toBe(false);
    });

    it('should be updating favorites when adding', async () => {
      const { isUpdatingFavorite, addToFavorites } = await renderStore(() =>
        useFavorites(props)
      );

      addToFavorites();
      expect(await firstValueFrom(isUpdatingFavorite)).toBe(true);
    });

    it('should NOT be updating favorites after add request is completed', async () => {
      const { isUpdatingFavorite, addToFavorites } = await renderStore(() =>
        useFavorites(props)
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
      title: 'Some Movie',
      id: 1,
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

  describe('action confirmation undo', () => {
    it('should re-add to favorites when the removal toast Undo runs', async () => {
      const { removeFromFavorites } = await renderStore(() =>
        useFavorites({ type: 'movie', id: 1, title: 'Some Movie' })
      );

      const removeRequests = await captureRequests(() => removeFromFavorites());
      expect(removeRequests).toContain('POST /sync/favorites/remove');

      const toast = notify.mock.calls.at(-1)?.[0] as
        | Omit<ActionToast, 'id'>
        | undefined;
      expect(toast?.action).toBeDefined();

      // Undo must fire the *add* endpoint - the real reversal.
      const undoRequests = await captureRequests(async () => {
        await toast?.action?.onAction();
      });
      expect(undoRequests).toContain('POST /sync/favorites');
      expect(undoRequests).not.toContain('POST /sync/favorites/remove');
    });
  });
});
