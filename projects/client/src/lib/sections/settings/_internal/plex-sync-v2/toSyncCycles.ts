import type { MediaSyncRun } from '$lib/requests/media-sync/models/MediaSyncRun.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { SyncCycle } from './models/SyncCycle.ts';

const CYCLE_WINDOW = time.minutes(1);

function isSameCycle(first: MediaSyncRun, run: MediaSyncRun): boolean {
  return run.kind === first.kind &&
    Math.abs(first.createdAt.getTime() - run.createdAt.getTime()) <=
      CYCLE_WINDOW;
}

type RunGroup = [MediaSyncRun, ...MediaSyncRun[]];

function groupRuns(runs: MediaSyncRun[]): RunGroup[] {
  return runs.reduce<RunGroup[]>((groups, run) => {
    const last = groups.at(-1);
    return last && isSameCycle(last[0], run)
      ? [...groups.slice(0, -1), [...last, run]]
      : [...groups, [run]];
  }, []);
}

function toCycleStatus(runs: MediaSyncRun[]): SyncCycle['status'] {
  if (runs.some((run) => run.status === 'failed')) return 'failed';
  if (
    runs.some((run) => run.status === 'planned' || run.status === 'running')
  ) {
    return 'running';
  }
  return 'done';
}

function toAddedByFeed(runs: MediaSyncRun[]): Record<string, number> {
  return runs
    .filter((run) => run.kind !== 'invalidate' && run.itemsWritten > 0)
    .reduce<Record<string, number>>(
      (added, run) => ({
        ...added,
        [run.feed]: (added[run.feed] ?? 0) + run.itemsWritten,
      }),
      {},
    );
}

function toCycle(runs: RunGroup): SyncCycle {
  const [first] = runs;
  const startedAt = runs.reduce(
    (earliest, run) => run.createdAt < earliest ? run.createdAt : earliest,
    first.createdAt,
  );
  return {
    id: first.id,
    kind: first.kind,
    startedAt,
    status: toCycleStatus(runs),
    addedByFeed: toAddedByFeed(runs),
    itemsSeen: runs.reduce((sum, run) => sum + run.itemsSeen, 0),
    itemsRemoved: runs.reduce((sum, run) => sum + run.itemsRemoved, 0),
    quietCount: 1,
    quietSince: startedAt,
  };
}

export function toSyncCycles(runs: MediaSyncRun[]): SyncCycle[] {
  const newestFirst = [...runs].sort((a, b) =>
    b.createdAt.getTime() - a.createdAt.getTime()
  );
  return groupRuns(newestFirst).map(toCycle);
}
