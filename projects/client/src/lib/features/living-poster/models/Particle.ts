import type { PosterBox } from './LivingPosterEffect.ts';
import type { ParticleEffect } from './ParticleEffect.ts';

export type Particle = {
  kind: ParticleEffect['kind'];
  box: PosterBox;
  x: number;
  y: number;
  size: number;
  length: number;
  dx: number;
  duration: number;
  phase: number;
  color: string;
};
