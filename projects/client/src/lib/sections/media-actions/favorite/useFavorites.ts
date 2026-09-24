import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { executeOrEnqueue } from '$lib/features/offline/executeOrEnqueue.ts';
import { findPendingOverride } from '$lib/features/offline/findPendingOverride.ts';
import { isAddEndpoint } from '$lib/features/offline/isAddEndpoint.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';
import { useIsQueued } from '$lib/features/offline/useIsQueued.ts';
import { useOfflineActions } from '$lib/features/offline/useOfflineActions.ts';
import { whenExecuted } from '$lib/features/offline/whenExecuted.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { combineLatest, map } from 'rxjs';

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
  const { favorites } = useUser();

  const { actions } = useOfflineActions();
  const { isQueued } = useIsQueued({
    domain: 'favorites',
    keys: [toMediaKey(type, id)],
  });

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

  const favoriting = useMutation(defineMutation({
    key: 'favorites:write',
    request: (action: 'add' | 'remove') =>
      executeOrEnqueue({
        endpoint: action === 'add' ? 'favorites:add' : 'favorites:remove',
        keys: [toMediaKey(type, id)],
        body: getFavoritesPayload({ type, id }),
        invalidations: [InvalidateAction.Favorited(type)],
      }),
    invalidations: whenExecuted([InvalidateAction.Favorited(type)]),
  }));

  return {
    isUpdatingFavorite: favoriting.isPending,
    isFavorited,
    isQueued,
    addToFavorites: async () => await favoriting.mutate('add'),
    removeFromFavorites: async () => await favoriting.mutate('remove'),
  };
}
