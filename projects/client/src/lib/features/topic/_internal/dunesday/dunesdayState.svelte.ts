import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import type { DunesdaySide } from './DunesdaySide.ts';
import type { FanSplit } from './FanSplit.ts';

const SIDE_KEY = 'dunesday-side';

const readSide = (): DunesdaySide => {
  const stored = safeLocalStorage.getItem(SIDE_KEY);
  return stored === 'dune' || stored === 'doom' ? stored : 'double';
};

const COSMETIC: FanSplit = { dune: 0, doom: 0, plays: 0, source: 'cosmetic' };

const state = $state<{ side: DunesdaySide; split: FanSplit }>({
  side: readSide(),
  split: COSMETIC,
});

export const dunesdayState = {
  get side() {
    return state.side;
  },
  set side(side: DunesdaySide) {
    state.side = side;
    safeLocalStorage.setItem(SIDE_KEY, side);
  },
  get split() {
    return state.split;
  },
  set split(split: FanSplit) {
    state.split = split;
  },
};
