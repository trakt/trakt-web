import type { LastWatchedItem } from '$lib/features/toast/models/LastWatchedItem.ts';
import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import { episodeActivityTitle } from '$lib/utils/intl/episodeActivityTitle.ts';

export function getToastTitle(item: NowPlayingItem | LastWatchedItem | Nil) {
  if (!item) {
    return '';
  }

  return item.type === 'movie'
    ? item.media.title
    : episodeActivityTitle(item.media, item.show);
}
