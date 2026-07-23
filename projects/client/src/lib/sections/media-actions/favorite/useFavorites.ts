import { useActionToast } from '$lib/features/action-toast/useActionToast.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { m } from '$lib/features/i18n/messages.ts';
import { executeOrEnqueue } from '$lib/features/offline/executeOrEnqueue.ts';
import { findPendingOverride } from '$lib/features/offline/findPendingOverride.ts';
import { isAddEndpoint } from '$lib/features/offline/isAddEndpoint.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';
import { useIsQueued } from '$lib/features/offline/useIsQueued.ts';
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

export function useFavorites({ type, id, title }: FavoritesStoreProps) {
  const isUpdatingFavorite = new BehaviorSubject(false);
  const { favorites } = useUser();
  const { invalidate } = useInvalidator();
  const { notify } = useActionToast();
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
    }

    notify({
      message: action === 'add'
        ? m.action_toast_added_to_favorites({ title })
        : m.action_toast_removed_from_favorites({ title }),
      action: {
        text: m.button_text_undo(),
        label: m.action_toast_label_undo(),
        style: 'outline',
        onAction: () =>
          addOrRemoveFavorite(action === 'add' ? 'remove' : 'add'),
      },
    });

    // Always clear: a queued action stays flagged via isQueued, and leaving
    // this pinned would re-disable the button once it syncs and dequeues.
    isUpdatingFavorite.next(false);
  };

  return {
    isUpdatingFavorite,
    isFavorited,
    isQueued,
    addToFavorites: async () => await addOrRemoveFavorite('add'),
    removeFromFavorites: async () => await addOrRemoveFavorite('remove'),
  };
}
