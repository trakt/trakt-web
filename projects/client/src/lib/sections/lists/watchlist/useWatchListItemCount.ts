import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { map, type Observable, of } from 'rxjs';
import type { WatchListStoreProps } from './useWatchList.ts';

export function useWatchListItemCount(
  props: WatchListStoreProps,
): { itemCount: Observable<number | undefined> } {
  const { watchlist } = useUser();

  const hasFilters = Object.keys(props.filter ?? {}).length > 0;

  if (props.intent === 'start' || hasFilters) {
    return { itemCount: of(undefined) };
  }

  return {
    itemCount: watchlist.pipe(
      map(($watchlist) => {
        if ($watchlist == null) {
          return undefined;
        }

        switch (props.type) {
          case 'movie':
            return $watchlist.movies.size;
          case 'show':
            return $watchlist.shows.size;
          default:
            return $watchlist.movies.size + $watchlist.shows.size;
        }
      }),
    ),
  };
}
