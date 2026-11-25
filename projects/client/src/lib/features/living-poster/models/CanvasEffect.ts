import type { LivingPosterEffect } from './LivingPosterEffect.ts';

export type CanvasEffect = LivingPosterEffect & {
  kind:
    | 'embers'
    | 'snow'
    | 'dust'
    | 'rain'
    | 'fireflies'
    | 'twinkle'
    | 'fog'
    | 'flare'
    | 'lightning';
};
