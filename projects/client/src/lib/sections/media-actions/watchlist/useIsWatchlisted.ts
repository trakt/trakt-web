import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { map } from 'rxjs';

export type IsWatchlistedStoreProps = MediaStoreProps;

export function useIsWatchlisted(props: IsWatchlistedStoreProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const { watchlist } = useUser();

  const isWatchlisted = watchlist.pipe(
    map(($watchlist) => {
      if (!$watchlist) {
        return false;
      }

      switch (type) {
        case 'movie':
          return media.every((m) => $watchlist.movies.has(m.id));
        case 'show':
          return media.every((m) => $watchlist.shows.has(m.id));
        case 'episode':
          return false;
      }
    }),
  );

  return {
    isWatchlisted,
  };
}
