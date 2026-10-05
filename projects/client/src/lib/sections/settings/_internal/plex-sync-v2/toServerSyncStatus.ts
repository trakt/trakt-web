import type { MediaSyncConnection } from '$lib/requests/media-sync/models/MediaSyncConnection.ts';
import type { ServerSyncStatus } from './models/ServerSyncStatus.ts';

export function toServerSyncStatus(
  connection: Pick<MediaSyncConnection, 'status' | 'lastSyncedAt'>,
): ServerSyncStatus {
  switch (connection.status) {
    case 'unreachable':
      return { kind: 'unreachable' };
    case 'unauthorized':
      return { kind: 'unauthorized' };
    case 'paused':
      return { kind: 'paused' };
    default:
      return connection.lastSyncedAt == null
        ? { kind: 'never' }
        : { kind: 'synced', at: connection.lastSyncedAt };
  }
}
