import type { DunesdaySide } from './DunesdaySide.ts';

const TARGETS: Record<DunesdaySide, number> = {
  dune: 0.8,
  double: 0.6,
  doom: 0.3,
};

export function seamTarget(side: DunesdaySide) {
  return TARGETS[side];
}
