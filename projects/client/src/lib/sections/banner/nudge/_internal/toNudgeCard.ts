import type { Nudge, NudgeLimit } from '$lib/requests/models/Nudge.ts';
import type { UserLimits } from '$lib/requests/models/UserLimits.ts';

export type NudgeMeter = {
  fill: number;
  base: number;
  over: number;
};

export type NudgeCard =
  | {
      kind: 'feature';
      amounts: {
        watchlistItems: number;
        totalListItems: number;
        totalNotes: number;
      };
    }
  | {
      kind: 'limit';
      metric: NudgeLimit;
      state: 'over' | 'within';
      used: number;
      total: number;
      vip: number;
      meter: NudgeMeter;
    };

type ToNudgeCardParams = {
  nudge: Nudge;
  limits: UserLimits;
};

function toMeter({ used, total }: { used: number; total: number }): NudgeMeter {
  const capacity = Math.max(used, total);

  return {
    fill: capacity > 0 ? used / capacity : 0,
    base: Math.min(used, total),
    over: Math.max(used - total, 0),
  };
}

export function toNudgeCard({ nudge, limits }: ToNudgeCardParams): NudgeCard {
  if (nudge.type === 'vip') {
    return {
      kind: 'feature',
      amounts: {
        watchlistItems: limits.watchlistItems.vip,
        totalListItems: limits.totalListItems.vip,
        totalNotes: limits.totalNotes.vip,
      },
    };
  }

  return {
    kind: 'limit',
    metric: nudge.limit,
    state: nudge.used > nudge.total ? 'over' : 'within',
    used: nudge.used,
    total: nudge.total,
    vip: limits[nudge.limit].vip,
    meter: toMeter(nudge),
  };
}
