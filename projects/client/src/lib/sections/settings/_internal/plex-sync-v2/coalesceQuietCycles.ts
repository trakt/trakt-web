import type { SyncCycle } from './models/SyncCycle.ts';

function isQuiet(cycle: SyncCycle): boolean {
  return cycle.status === 'done' &&
    cycle.kind !== 'invalidate' &&
    Object.keys(cycle.addedByFeed).length === 0;
}

export function coalesceQuietCycles(cycles: SyncCycle[]): SyncCycle[] {
  return cycles.reduce<SyncCycle[]>((merged, cycle) => {
    const last = merged.at(-1);
    if (!last || !isQuiet(last) || !isQuiet(cycle)) return [...merged, cycle];

    return [
      ...merged.slice(0, -1),
      {
        ...last,
        quietCount: last.quietCount + cycle.quietCount,
        quietSince: cycle.quietSince,
      },
    ];
  }, []);
}
