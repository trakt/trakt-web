import type { MediaSyncLibrary } from '$lib/requests/media-sync/models/MediaSyncConnection.ts';
import type { MediaSyncFeed } from '$lib/requests/media-sync/models/MediaSyncFeed.ts';
import type { MediaSyncConnectionChanges } from '$lib/requests/media-sync/updateMediaSyncConnectionRequest.ts';

type ManageDraft = {
  libraries: Pick<MediaSyncLibrary, 'id' | 'enabled'>[];
  enabledLibraryIds: number[];
  currentFeeds: MediaSyncFeed[];
  feeds: MediaSyncFeed[];
  currentAccountId: string | null;
  accountId: string | null;
};

function hasSameLibraries(
  libraries: ManageDraft['libraries'],
  enabledLibraryIds: number[],
): boolean {
  const current = libraries.filter((library) => library.enabled);
  return current.length === enabledLibraryIds.length &&
    current.every((library) => enabledLibraryIds.includes(library.id));
}

function hasSameFeeds(
  currentFeeds: MediaSyncFeed[],
  feeds: MediaSyncFeed[],
): boolean {
  return currentFeeds.length === feeds.length &&
    currentFeeds.every((feed) => feeds.includes(feed));
}

export function toManageChanges(
  {
    libraries,
    enabledLibraryIds,
    currentFeeds,
    feeds,
    currentAccountId,
    accountId,
  }: ManageDraft,
): MediaSyncConnectionChanges {
  const isAccountChanged = accountId != null && accountId !== currentAccountId;

  return {
    ...(hasSameLibraries(libraries, enabledLibraryIds)
      ? {}
      : { enabledLibraryIds }),
    ...(hasSameFeeds(currentFeeds, feeds) ? {} : { feeds }),
    ...(isAccountChanged ? { syncAccountId: accountId } : {}),
  };
}
