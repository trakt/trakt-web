import type { PulseGraphItem } from '../models/PulseGraphItem.ts';
import type { PulseItem } from '../models/PulseItem.ts';
import type { PulseStatItem } from '../models/PulseStatItem.ts';

const maxConsecutiveGraphs = 2;

export function interleaveByScore(
  stats: ReadonlyArray<PulseStatItem>,
  graphs: ReadonlyArray<PulseGraphItem>,
): PulseItem[] {
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
