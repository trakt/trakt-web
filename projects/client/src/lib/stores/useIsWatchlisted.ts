import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { findPendingOverride } from '$lib/features/offline/findPendingOverride.ts';
import { isAddEndpoint } from '$lib/features/offline/isAddEndpoint.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';
import { useOfflineActions } from '$lib/features/offline/useOfflineActions.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { combineLatest, map } from 'rxjs';

export type IsWatchlistedStoreProps = MediaStoreProps;

export function useIsWatchlisted(props: IsWatchlistedStoreProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const { watchlist } = useUser();
  const { actions } = useOfflineActions();

  const isWatchlisted = combineLatest([watchlist, actions]).pipe(
    map(([$watchlist, $actions]) => {
      if (type === 'episode') {
        return false;
      }

      const pending = findPendingOverride({
        actions: $actions,
        domain: 'watchlist',
        keys: media.map((m) => toMediaKey(type, m.id)),
      });

      if (pending) {
        return isAddEndpoint(pending.endpoint);
      }

      if (!$watchlist) {
        return false;
      }

      switch (type) {
        case 'movie':
          return media.every((m) => $watchlist.movies.has(m.id));
        case 'show':
          return media.every((m) => $watchlist.shows.has(m.id));
      }
    }),
  );

  return {
    isWatchlisted,
  };
}
