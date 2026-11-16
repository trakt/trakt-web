import type { LivingPosterEffect } from './LivingPosterEffect.ts';

export type LivingPosterLayer = {
  src: string;
  shift: number;
};

export type LivingPoster = {
  layers: ReadonlyArray<LivingPosterLayer>;
  mask: string | null;
  effects: ReadonlyArray<LivingPosterEffect>;
};
