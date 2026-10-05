import type { MediaSyncRun } from '$lib/requests/media-sync/models/MediaSyncRun.ts';
import { describe, expect, it } from 'vitest';
import { toSyncCycles } from './toSyncCycles.ts';

function run(overrides: Partial<MediaSyncRun>): MediaSyncRun {
  return {
    id: 1,
    libraryId: null,
    kind: 'incremental',
    feed: 'history',
    status: 'completed',
    itemsSeen: 0,
    itemsWritten: 0,
    itemsRemoved: 0,
    error: null,
    createdAt: new Date('2026-10-05T16:38:01Z'),
    finishedAt: new Date('2026-10-05T16:38:16Z'),
    ...overrides,
  };
}

describe('toSyncCycles', () => {
  it('groups the runs that one sync started together', () => {
    const cycles = toSyncCycles([
      run({ id: 4, feed: 'watchlist', itemsSeen: 3 }),
      run({ id: 3, feed: 'history', itemsWritten: 2 }),
      run({ id: 2, feed: 'collection', libraryId: 38, itemsWritten: 1 }),
      run({ id: 1, feed: 'collection', libraryId: 37, itemsWritten: 4 }),
      run({
        id: 0,
        createdAt: new Date('2026-10-05T15:37:02Z'),
      }),
    ]);

    expect(cycles).to.have.length(2);
    expect(cycles[0]).to.deep.include({
      id: 4,
      status: 'done',
      addedByFeed: { history: 2, collection: 5 },
      itemsSeen: 3,
    });
  });

  it('keeps different kinds of sync apart', () => {
    const cycles = toSyncCycles([
      run({ id: 2, kind: 'invalidate', itemsSeen: 927, itemsRemoved: 1 }),
      run({ id: 1, kind: 'incremental', itemsWritten: 1 }),
    ]);

    expect(cycles.map((cycle) => cycle.kind)).to.deep.equal([
      'invalidate',
      'incremental',
    ]);
    expect(cycles[0]).to.deep.include({
      itemsSeen: 927,
      itemsRemoved: 1,
      addedByFeed: {},
    });
  });

  it('reports a sync as failed when any of its runs failed', () => {
    const [cycle] = toSyncCycles([
      run({ id: 2, status: 'completed' }),
      run({ id: 1, status: 'failed' }),
    ]);

    expect(cycle?.status).to.equal('failed');
  });

  it('reports a sync as running while any of its runs is unfinished', () => {
    const [cycle] = toSyncCycles([
      run({ id: 2, status: 'completed' }),
      run({ id: 1, status: 'planned', finishedAt: null }),
    ]);

    expect(cycle?.status).to.equal('running');
  });
});
