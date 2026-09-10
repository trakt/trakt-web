import type { PlexServer } from '$lib/requests/plex/plexServersQuery.ts';
import type { PlexServersState } from './usePlexSync.ts';

export type PlexSyncedServersProps = {
  servers: ReadonlyArray<PlexServer>;
  serversState: PlexServersState;
  isSyncing: boolean;
  onSyncNow: (serverId: string) => void;
  onRetryServers: () => void;
};
