import type { PulseStat } from './pulseStats.ts';
import type { PulseGraphData, PulseGraphType } from './pulseGraphs.ts';

export type PulseStatItem = {
  readonly type: 'stat';
  readonly key: string;
  readonly score: number;
  readonly span?: number;
} & PulseStat;

export type PulseGraphItem = {
  readonly type: 'graph';
  readonly key: string;
  readonly kind: PulseGraphType;
  readonly data: PulseGraphData;
  readonly score: number;
  readonly span: number;
};

export type PulseItem = PulseStatItem | PulseGraphItem;

const maxConsecutiveGraphs = 2;

export function normalizeScore(
  raw: number,
  maxPossible: number,
): number {
  if (maxPossible <= 0) return 0;
  return Math.min((raw / maxPossible) * 100, 100);
}

export function interleaveByScore(
  stats: ReadonlyArray<PulseStatItem>,
  graphs: ReadonlyArray<PulseGraphItem>,
): readonly PulseItem[] {
  const all: PulseItem[] = [...stats, ...graphs]
    .sort((a, b) => b.score - a.score);

  const result: PulseItem[] = [];
  let consecutiveGraphs = 0;
  const deferredGraphs: PulseGraphItem[] = [];

  for (const item of all) {
    if (item.type === 'graph') {
      if (consecutiveGraphs >= maxConsecutiveGraphs) {
        deferredGraphs.push(item);
        continue;
      }
      consecutiveGraphs++;
    } else {
      consecutiveGraphs = 0;
      if (deferredGraphs.length > 0) {
        result.push(item);
        const toInsert = deferredGraphs.splice(0, maxConsecutiveGraphs);
        result.push(...toInsert);
        consecutiveGraphs = toInsert.length;
        continue;
      }
    }
    result.push(item);
  }

  result.push(...deferredGraphs);

  return result;
}
