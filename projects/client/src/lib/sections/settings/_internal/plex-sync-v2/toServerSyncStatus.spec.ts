import { describe, expect, it } from 'vitest';
import { toServerSyncStatus } from './toServerSyncStatus.ts';

describe('toServerSyncStatus', () => {
  it('reports when an active server last synced', () => {
    const at = new Date('2026-10-05T09:00:00Z');

    expect(toServerSyncStatus({ status: 'active', lastSyncedAt: at }))
      .to.deep.equal({ kind: 'synced', at });
  });

  it('reports a server that has not synced yet', () => {
    expect(toServerSyncStatus({ status: 'active', lastSyncedAt: null }))
      .to.deep.equal({ kind: 'never' });
  });

  it('surfaces the states that need the user', () => {
    const at = new Date('2026-10-05T09:00:00Z');

    expect(toServerSyncStatus({ status: 'unreachable', lastSyncedAt: at }).kind)
      .to.equal('unreachable');
    expect(
      toServerSyncStatus({ status: 'unauthorized', lastSyncedAt: at }).kind,
    )
      .to.equal('unauthorized');
    expect(toServerSyncStatus({ status: 'paused', lastSyncedAt: at }).kind)
      .to.equal('paused');
  });
});
