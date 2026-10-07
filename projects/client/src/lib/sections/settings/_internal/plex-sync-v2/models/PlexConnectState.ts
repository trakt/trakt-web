import type { MediaSyncAccount } from '$lib/requests/media-sync/models/MediaSyncAccount.ts';
import type { MediaSyncFeed } from '$lib/requests/media-sync/models/MediaSyncFeed.ts';
import type { PlexLibraryOption } from '$lib/requests/media-sync/plexServerLibrariesRequest.ts';
import type { PlexServerOption } from '$lib/requests/media-sync/plexPinStatusRequest.ts';

export type PlexConnectState =
  | { step: 'idle' }
  | { step: 'starting' }
  | { step: 'waiting'; attemptId: string; authUrl: string }
  | {
    step: 'choosing';
    attemptId: string;
    servers: PlexServerOption[];
    serverId: string | null;
    libraries: PlexLibraryOption[] | null;
    libraryIds: string[];
    accounts: MediaSyncAccount[] | null;
    accountId: string | null;
    feeds: MediaSyncFeed[];
  }
  | { step: 'connecting' }
  | { step: 'expired' }
  | { step: 'failed'; error: string };
