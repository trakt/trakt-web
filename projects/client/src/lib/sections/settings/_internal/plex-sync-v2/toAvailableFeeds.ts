import type { MediaSyncConnection } from '$lib/requests/media-sync/models/MediaSyncConnection.ts';
import {
  type MediaSyncFeed,
  MediaSyncFeedSchema,
} from '$lib/requests/media-sync/models/MediaSyncFeed.ts';
import { JELLYFIN_FEEDS } from './JELLYFIN_FEEDS.ts';
import { PLEX_ACCOUNT_SERVER_ID } from './PLEX_ACCOUNT_SERVER_ID.ts';

export function toAvailableFeeds(
  connection: Pick<MediaSyncConnection, 'provider' | 'serverId'>,
): readonly MediaSyncFeed[] {
  if (connection.provider === 'jellyfin') return JELLYFIN_FEEDS;
  if (connection.serverId === PLEX_ACCOUNT_SERVER_ID) return ['watchlist'];
  return MediaSyncFeedSchema.options;
}
