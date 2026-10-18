import type { MediaSyncConnection } from '$lib/requests/media-sync/models/MediaSyncConnection.ts';
import type { ServerSyncStatus } from './models/ServerSyncStatus.ts';

const UNREACHABLE_AFTER_FAILURES = 2;

function isFailingToReach({
  failureCount,
  lastFailureKind,
}: Pick<MediaSyncConnection, 'failureCount' | 'lastFailureKind'>): boolean {
  return (
    lastFailureKind === 'unreachable' &&
    failureCount >= UNREACHABLE_AFTER_FAILURES
  );
}

export function toServerSyncStatus(
  connection: Pick<
    MediaSyncConnection,
    'status' | 'lastSyncedAt' | 'failureCount' | 'lastFailureKind'
  >,
): ServerSyncStatus {
  switch (connection.status) {
    case 'unreachable':
      return { kind: 'unreachable' };
    case 'unauthorized':
      return { kind: 'unauthorized' };
    case 'paused':
      return { kind: 'paused' };
    case 'webhook_only':
      return { kind: 'webhook-only' };
    default:
      if (isFailingToReach(connection)) return { kind: 'unreachable' };
      return connection.lastSyncedAt == null
        ? { kind: 'never' }
        : { kind: 'synced', at: connection.lastSyncedAt };
  }
}
