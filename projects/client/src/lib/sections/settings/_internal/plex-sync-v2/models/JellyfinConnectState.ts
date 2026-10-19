import type { JellyfinLibraryOption } from '$lib/requests/media-sync/models/JellyfinAuth.ts';
import type { MediaSyncFeed } from '$lib/requests/media-sync/models/MediaSyncFeed.ts';

export type JellyfinConnectState =
  | { step: 'idle' }
  | { step: 'signing-in'; isSubmitting: boolean; error: string | null }
  | { step: 'waiting'; attemptId: string; code: string; serverName: string }
  | {
      step: 'choosing';
      attemptId: string;
      serverName: string;
      libraries: JellyfinLibraryOption[];
      libraryIds: string[];
      feeds: MediaSyncFeed[];
      importHistory: boolean;
    }
  | { step: 'connecting' }
  | { step: 'expired' }
  | { step: 'failed'; error: string };
