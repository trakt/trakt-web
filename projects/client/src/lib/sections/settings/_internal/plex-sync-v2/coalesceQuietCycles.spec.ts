import { describe, expect, it } from 'vitest';
import { coalesceQuietCycles } from './coalesceQuietCycles.ts';
import type { SyncCycle } from './models/SyncCycle.ts';

function cycle(id: number, overrides: Partial<SyncCycle> = {}): SyncCycle {
  const at = new Date(Date.UTC(2026, 9, 5, id));
  return {
    id,
    kind: 'incremental',
    startedAt: at,
    status: 'done',
    addedByFeed: {},
    itemsSeen: 0,
    itemsRemoved: 0,
    quietCount: 1,
    quietSince: at,
    ...overrides,
  };
}

describe('coalesceQuietCycles', () => {
  it('folds back-to-back syncs that found nothing into one', () => {
    const [merged, ...rest] = coalesceQuietCycles([
      cycle(9),
      cycle(8),
      cycle(7),
    ]);

    expect(rest).to.have.length(0);
    expect(merged).to.deep.include({
      id: 9,
      quietCount: 3,
      quietSince: new Date(Date.UTC(2026, 9, 5, 7)),
    });
  });

  it('keeps syncs that added something on their own', () => {
    const merged = coalesceQuietCycles([
      cycle(9),
      cycle(8, { addedByFeed: { history: 1 } }),
      cycle(7),
      cycle(6),
    ]);

    expect(merged.map(({ id, quietCount }) => [id, quietCount])).to.deep
      .equal([[9, 1], [8, 1], [7, 2]]);
  });

  it('never folds failed syncs or library checks', () => {
    const merged = coalesceQuietCycles([
      cycle(9, { status: 'failed' }),
      cycle(8, { status: 'failed' }),
      cycle(7, { kind: 'invalidate' }),
      cycle(6, { kind: 'invalidate' }),
    ]);

    expect(merged).to.have.length(4);
  });
});
