import type { LivingPosterEffect } from './LivingPosterEffect.ts';

export type ParticleEffect = LivingPosterEffect & {
  kind: 'embers' | 'snow' | 'dust' | 'rain' | 'fireflies' | 'twinkle';
};
