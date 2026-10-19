import type { MediaSyncFeed } from '$lib/requests/media-sync/models/MediaSyncFeed.ts';

export const JELLYFIN_FEEDS: readonly MediaSyncFeed[] = [
  'history',
  'collection',
];
