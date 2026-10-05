import * as m from '$lib/features/i18n/messages.ts';
import type { MediaSyncFeed } from '$lib/requests/media-sync/models/MediaSyncFeed.ts';

const FEED_TITLE: Record<MediaSyncFeed, () => string> = {
  history: m.label_media_sync_feed_history,
  ratings: m.label_media_sync_feed_ratings,
  collection: m.label_media_sync_feed_collection,
  watchlist: m.label_media_sync_feed_watchlist,
};

export function toFeedTitle(feed: string): string {
  return feed in FEED_TITLE ? FEED_TITLE[feed as MediaSyncFeed]() : feed;
}
