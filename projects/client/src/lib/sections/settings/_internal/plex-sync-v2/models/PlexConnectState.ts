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
  }
  | { step: 'connecting' }
  | { step: 'expired' }
  | { step: 'failed'; error: string };
