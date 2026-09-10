import { undoToastAction } from '$lib/features/action-toast/undoToastAction.ts';
import { toGatedNotify } from '$lib/features/action-toast/toGatedNotify.ts';
import { useActionToast } from '$lib/features/action-toast/useActionToast.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { m } from '$lib/features/i18n/messages.ts';
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
  isToastEnabled?: boolean;
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

export function useFavorites(
  { type, id, title, isToastEnabled = true }: FavoritesStoreProps,
) {
  const { favorites } = useUser();
  const notify = toGatedNotify(useActionToast().notify, isToastEnabled);

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

  const addOrRemoveFavorite = async (action: 'add' | 'remove') => {
    await favoriting.mutate(action);

    notify({
      message: action === 'add'
        ? m.action_toast_added_to_favorites({ title })
        : m.action_toast_removed_from_favorites({ title }),
      action: undoToastAction(() =>
        addOrRemoveFavorite(action === 'add' ? 'remove' : 'add')
      ),
    });
  };

  return {
    isUpdatingFavorite: favoriting.isPending,
    isFavorited,
    isQueued,
    addToFavorites: async () => await addOrRemoveFavorite('add'),
    removeFromFavorites: async () => await addOrRemoveFavorite('remove'),
  };
}
