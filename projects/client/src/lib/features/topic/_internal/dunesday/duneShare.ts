import type { DunesdaySide } from './DunesdaySide.ts';
import type { FanSplit } from './FanSplit.ts';

const SIDE_NUDGE: Record<DunesdaySide, number> = {
  dune: 0.07,
  double: 0,
  doom: -0.07,
};

export function duneShare(split: FanSplit, side: DunesdaySide) {
  const base =
    split.source === 'history'
      ? (split.dune + 1) / (split.dune + split.doom + 2)
      : 0.5;
  const share = Math.min(0.92, Math.max(0.08, base + SIDE_NUDGE[side]));
  return Math.round(share * 100);
}
