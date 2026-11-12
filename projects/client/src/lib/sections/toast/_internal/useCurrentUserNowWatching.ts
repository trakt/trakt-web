import { map } from 'rxjs';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { hasNowPlayingEnded } from '$lib/features/toast/hasNowPlayingEnded.ts';
import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import { userWatchingQuery } from '$lib/requests/queries/users/userWatchingQuery.ts';

const toActiveItem = (item: NowPlayingItem | Nil) => {
  if (!item) return null;
  if (hasNowPlayingEnded(item, Date.now())) return null;

  return item;
};

export function useCurrentUserNowWatching() {
  const response = useQuery(
    userWatchingQuery({
      slug: 'me',
    }),
  );

  return {
    nowWatching: response.pipe(
      map(($response) => toActiveItem($response.data)),
    ),
  };
}
