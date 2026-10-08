import { pickRandom } from '$lib/utils/array/pickRandom.ts';
import type { GameSlot } from './GameSlot.ts';
import type { GameTitle } from './GameTitle.ts';
import { pickNextTitle } from './pickNextTitle.ts';

type SlotDeckParams = {
  pool: ReadonlyArray<GameTitle>;
  random: () => number;
};

type DrawParams = {
  after: GameSlot;
  streak: number;
};

export function createSlotDeck({ pool, random }: SlotDeckParams) {
  let usedKeys: ReadonlySet<string> = new Set();
  let lastId = 0;

  const toSlot = (title: GameTitle): GameSlot => {
    usedKeys = new Set([...usedKeys, title.key]);
    lastId += 1;
    return { id: lastId, title };
  };

  const draw = ({ after, streak }: DrawParams): GameSlot =>
    toSlot(
      pickNextTitle({ pool, current: after.title, usedKeys, streak, random }) ??
        after.title,
    );

  const opening = (): ReadonlyArray<GameSlot> => {
    const first = pickRandom(pool, random);
    if (!first) return [];

    const known = toSlot(first);
    const mystery = draw({ after: known, streak: 0 });

    return [known, mystery, draw({ after: mystery, streak: 0 })];
  };

  return { opening, draw };
}
