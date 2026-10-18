import { describe, expect, it } from 'vitest';
import { toServerSyncStatus } from './toServerSyncStatus.ts';

const healthy = { failureCount: 0, lastFailureKind: null };

describe('toServerSyncStatus', () => {
  it('reports when an active server last synced', () => {
    const at = new Date('2026-10-05T09:00:00Z');

    expect(
      toServerSyncStatus({ ...healthy, status: 'active', lastSyncedAt: at }),
    ).to.deep.equal({ kind: 'synced', at });
  });

  it('reports a server that has not synced yet', () => {
    expect(
      toServerSyncStatus({ ...healthy, status: 'active', lastSyncedAt: null }),
    ).to.deep.equal({ kind: 'never' });
  });

  it('surfaces the states that need the user', () => {
    const at = new Date('2026-10-05T09:00:00Z');

    expect(
      toServerSyncStatus({
        ...healthy,
        status: 'unreachable',
        lastSyncedAt: at,
      }).kind,
    ).to.equal('unreachable');
    expect(
      toServerSyncStatus({
        ...healthy,
        status: 'unauthorized',
        lastSyncedAt: at,
      }).kind,
    ).to.equal('unauthorized');
    expect(
      toServerSyncStatus({ ...healthy, status: 'paused', lastSyncedAt: at })
        .kind,
    ).to.equal('paused');
  });

  it('should show an active server as unreachable once it keeps failing to reach it', () => {
    const at = new Date('2026-10-05T09:00:00Z');
    const failing = { status: 'active' as const, lastSyncedAt: at };

    expect(
      toServerSyncStatus({
        ...failing,
        failureCount: 2,
        lastFailureKind: 'unreachable',
      }).kind,
    ).to.equal('unreachable');
    expect(
      toServerSyncStatus({
        ...failing,
        failureCount: 1,
        lastFailureKind: 'unreachable',
      }).kind,
    ).to.equal('synced');
    expect(
      toServerSyncStatus({
        ...failing,
        failureCount: 5,
        lastFailureKind: 'provider_error',
      }).kind,
    ).to.equal('synced');
  });

  it('reports a server that only gets the Plex webhook', () => {
    expect(
      toServerSyncStatus({
        ...healthy,
        status: 'webhook_only',
        lastSyncedAt: null,
      }),
    ).to.deep.equal({ kind: 'webhook-only' });
  });
});
