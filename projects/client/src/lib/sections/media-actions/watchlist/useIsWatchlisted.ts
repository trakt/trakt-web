import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map } from 'rxjs';

export type IsWatchlistedStoreProps = MediaStoreProps;

export function useIsWatchlisted(props: IsWatchlistedStoreProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const { watchlist } = useUser();

  const isWatchlisted = toObservable(watchlist).pipe(
    map((w) => {
      if (!w) {
        return false;
      }

      switch (type) {
        case 'movie':
          return media.every((m) => w.movies.has(m.id));
        case 'show':
          return media.every((m) => w.shows.has(m.id));
        case 'episode':
          return false;
      }
    }),
  );

  return {
    isWatchlisted,
  };
}
