import type { MediaSyncLibrary } from '$lib/requests/media-sync/models/MediaSyncConnection.ts';
import type { MediaSyncConnectionChanges } from '$lib/requests/media-sync/updateMediaSyncConnectionRequest.ts';

type ManageDraft = {
  libraries: Pick<MediaSyncLibrary, 'id' | 'enabled'>[];
  enabledLibraryIds: number[];
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

export function toManageChanges(
  { libraries, enabledLibraryIds, currentAccountId, accountId }: ManageDraft,
): MediaSyncConnectionChanges {
  const isAccountChanged = accountId != null && accountId !== currentAccountId;

  return {
    ...(hasSameLibraries(libraries, enabledLibraryIds)
      ? {}
      : { enabledLibraryIds }),
    ...(isAccountChanged ? { syncAccountId: accountId } : {}),
  };
}
