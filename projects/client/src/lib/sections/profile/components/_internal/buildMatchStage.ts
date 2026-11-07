import type { MatchStripEntry } from './buildMatchStrip.ts';

export type MatchStageSlot = {
  x: number;
  y: number;
  tilt: number;
  layer: number;
};

export type MatchStage = {
  size: 'large' | 'small';
  cards: (MatchStripEntry & MatchStageSlot)[];
  more: number;
};

const SLOTS: Record<number, MatchStageSlot[]> = {
  1: [{ x: 0, y: 12, tilt: -2, layer: 1 }],
  2: [
    { x: -58, y: 14, tilt: -7, layer: 2 },
    { x: 58, y: 22, tilt: 6, layer: 1 },
  ],
  3: [
    { x: -108, y: 30, tilt: -8, layer: 1 },
    { x: 0, y: 10, tilt: 0, layer: 3 },
    { x: 108, y: 30, tilt: 8, layer: 2 },
  ],
  4: [
    { x: -102, y: 32, tilt: -8, layer: 1 },
    { x: -34, y: 16, tilt: -3, layer: 2 },
    { x: 34, y: 16, tilt: 3, layer: 3 },
    { x: 102, y: 32, tilt: 8, layer: 2 },
  ],
  5: [
    { x: -134, y: 40, tilt: -10, layer: 1 },
    { x: -68, y: 22, tilt: -5, layer: 2 },
    { x: 0, y: 14, tilt: 0, layer: 3 },
    { x: 68, y: 22, tilt: 5, layer: 2 },
    { x: 134, y: 40, tilt: 10, layer: 1 },
  ],
};

export const MATCH_STAGE_LIMIT = 5;

export function buildMatchStage(
  entries: MatchStripEntry[],
  total: number,
): MatchStage {
  const shown = entries.slice(0, MATCH_STAGE_LIMIT);
  const slots = SLOTS[shown.length] ?? [];

  return {
    size: shown.length > 3 ? 'small' : 'large',
    cards: shown.flatMap((entry, index) => {
      const slot = slots[index];
      return slot ? [{ ...entry, ...slot }] : [];
    }),
    more: Math.max(0, total - shown.length),
  };
}
