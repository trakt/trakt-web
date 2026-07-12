import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { executeOrEnqueue } from '$lib/features/offline/executeOrEnqueue.ts';
import { findPendingOverride } from '$lib/features/offline/findPendingOverride.ts';
import { isAddEndpoint } from '$lib/features/offline/isAddEndpoint.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';
import { useOfflineActions } from '$lib/features/offline/useOfflineActions.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

export type FavoritesStoreProps = {
  type: MediaType;
  id: number;
  title: string;
};

function getFavoritesPayload(
  { type, id }: Pick<FavoritesStoreProps, 'type' | 'id'>,
) {
  switch (type) {
    case 'movie':
      return { movies: [{ ids: { trakt: id } }] };
    case 'show':
      return { shows: [{ ids: { trakt: id } }] };
  }
}

export function useFavorites({ type, id }: FavoritesStoreProps) {
  const isUpdatingFavorite = new BehaviorSubject(false);
  const { favorites } = useUser();
  const { invalidate } = useInvalidator();
  const { actions } = useOfflineActions();

  const isFavorited = combineLatest([favorites, actions]).pipe(
    map(([$favorites, $actions]) => {
      const pending = findPendingOverride({
        actions: $actions,
        domain: 'favorites',
        keys: [toMediaKey(type, id)],
      });

      if (pending) {
        return isAddEndpoint(pending.endpoint);
      }

      if (!$favorites) {
        return false;
      }

      switch (type) {
        case 'movie':
          return $favorites.movies.has(id);
        case 'show':
          return $favorites.shows.has(id);
      }
    }),
  );

  const addOrRemoveFavorite = async (action: 'add' | 'remove') => {
    isUpdatingFavorite.next(true);

    const payload = getFavoritesPayload({ type, id });

    const result = await executeOrEnqueue({
      endpoint: action === 'add' ? 'favorites:add' : 'favorites:remove',
      keys: [toMediaKey(type, id)],
      body: payload,
      invalidations: [InvalidateAction.Favorited(type)],
    });

    if (result === 'executed') {
      await invalidate(InvalidateAction.Favorited(type));
      isUpdatingFavorite.next(false);
    }
  };

  return {
    isUpdatingFavorite,
    isFavorited,
    addToFavorites: async () => await addOrRemoveFavorite('add'),
    removeFromFavorites: async () => await addOrRemoveFavorite('remove'),
  };
}
