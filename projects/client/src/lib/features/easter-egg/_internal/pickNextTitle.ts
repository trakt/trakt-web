import { pickRandom } from '$lib/utils/array/pickRandom.ts';
import type { GameTitle } from './GameTitle.ts';

type PickNextTitleParams = {
  pool: ReadonlyArray<GameTitle>;
  current: GameTitle;
  usedKeys: ReadonlySet<string>;
  streak: number;
  random: () => number;
};

type GapBand = {
  min: number;
  max: number;
};

function gapBandFor(streak: number): GapBand {
  if (streak >= 10) return { min: 0, max: 5 };
  if (streak >= 5) return { min: 3, max: 15 };

  return { min: 10, max: 100 };
}

function isInBand(gap: number, { min, max }: GapBand) {
  return gap >= min && gap <= max;
}

export function pickNextTitle({
  pool,
  current,
  usedKeys,
  streak,
  random,
}: PickNextTitleParams): GameTitle | undefined {
  const others = pool.filter((title) => title.key !== current.key);
  const fresh = others.filter((title) => !usedKeys.has(title.key));
  const candidates = fresh.length > 0 ? fresh : others;

  const band = gapBandFor(streak);
  const inBand = candidates.filter((title) =>
    isInBand(Math.abs(title.rating - current.rating), band),
  );
  const choices = inBand.length > 0 ? inBand : candidates;

  return pickRandom(choices, random);
}
